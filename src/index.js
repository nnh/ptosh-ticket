import moment from 'moment';
import 'moment/locale/ja';
import fs from 'fs';

import createText from './template';
import doRequest from './do_request';

const baseUrl = 'https://www.pivotaltracker.com/services/v5/projects/246313';
const membershipsUrl = `${baseUrl}/memberships`;
const storiesUrl = `${baseUrl}/stories?filter=state:accepted`;
const headers = {};

// API tokenをセットする。
function setToken(token) {
  headers['X-TrackerToken'] = token;
}

// ユーザー一覧を取得、IDをkeyにして名前を格納する。
async function getMembers() {
  const options = {
    url: membershipsUrl,
    headers: headers,
    json: true
  };

  const response = await doRequest(options);
  const members = {};
  for (const member of response) {
    members[member.person.id] = member.person.name;
  }
  return members;
}

// ストーリー一覧を取得、「# 要求」が存在するストーリーだけ返す。
async function getStories() {
  const options = {
    url: storiesUrl,
    headers: headers,
    json: true
  };

  const response = await doRequest(options);
  const stories = [];
  for (const story of response) {
    if (/# 要求/.test(story.description)) { stories.push(story); }
  }
  return stories;
}

// 指定storyIdのActivity一覧を取得する。
async function getActivities(storyId) {
  const options = {
    url: `${baseUrl}/stories/${storyId}/activity`,
    headers: headers,
    json: true
  };

  return await doRequest(options);
}

// descriptionを「#」で分割して、指定wordの内容を返す。
function splitDescription(description, word) {
  const reg = new RegExp(`${word}\\s`);
  const target = description.split(/#+\s/).filter(v => reg.test(v));

  if (target.length === 0) { return ''; }
  const splitedTarget = target[0].split('\n');
  return splitedTarget.slice(1, splitedTarget.length).filter(v => v).join('<br>').replace(/\\n/g, '<br>');
}

// ラベルの名前一覧を取得する。
function getLabels(labels) {
  if (labels.length === 0)  { return ''; }
  return labels.map((v) => v.name).join(', ');
}

// 指定typeのdateを特定のフォーマットで返す。
function getDateFromActivity(activities, type) {
  const reg = new RegExp(type);
  for (const activity of activities) {
    if (reg.test(activity.message)) {
      return moment(activity.occurred_at).format('LL');
    }
  }
  return '';
}

// ActivityからGithubのリンクを取得する。
function getGithubLink(activities) {
  let text = [];

  for (const activity of activities) {
    if (!/Merge pull request/.test(activity.message)) { continue; }

    const lines = activity.message.split('\n');
    const urls = lines.filter((v) => /https:\/\/github.com\//.test(v));
    text.push(urls.join('<br>'));
  }

  return text.join('<br>');
}

// データを元にhtmlのテキストを作成する。
async function createHtmlText(members, stories) {
  const tickets = [];
  for (const story of stories) {
    const activities = await getActivities(story.id);

    const text = createText({
      id: `#${story.id}`,
      category: getLabels(story.labels),
      requestor: members[story.requested_by_id],
      requestedOn: moment(story.created_at).format('LL'),
      request: splitDescription(story.description, '要求'),
      createdBy: members[story.owner_ids[0]],
      createdOn: getDateFromActivity(activities, 'estimated'),
      specification: splitDescription(story.description, '仕様'),
      riskAssessment: splitDescription(story.description, 'リスク'),
      approver: 'Shuhei Kondo',
      approved: getDateFromActivity(activities, 'delivered'),
      testedBy: members[story.requested_by_id],
      testScript: splitDescription(story.description, 'テスト'),
      approvedBy: 'Toshiki Saito',
      testCode: getGithubLink(activities),
      authoriser: 'Toshiki Saito',
      finalApproved: moment(story.accepted_at).format('LL')
    });

    tickets.push({ id: story.id, text: text });
  }

  return tickets;
}

// データを元にファイルを作成する。
function writeFile(tickets) {
  const dir = './dist/files';
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }

  for (const ticket of tickets) {
    fs.writeFile(`./dist/files/${ticket.id}.html`, ticket.text, (error) => {
      if (error) { console.log(error); }
    });
  }
}

async function generate(token) {
  setToken(token);
  const results = await Promise.all([getMembers(), getStories()]);
  const tickets = await createHtmlText(results[0], results[1]);
  writeFile(tickets);
}

exports.generate = generate;
