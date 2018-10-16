export default function createText(data) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style type="text/css">
        <!--
            body { margin-left: 30px; margin-right: 30px; }
            h2 { text-align: center; }
            .mb-0 { margin-bottom: 0px; }
        -->
        </style>
      </head>
      <body>
        <h2>Ptoshチケットサマリー</h2>
        <h3>1. 要求仕様</h3>
        <h4 class="mb-0">1.1. ID</h4>
        ${data.id}
        <h4 class="mb-0">1.2. カテゴリー</h4>
        ${data.category}
        <h4 class="mb-0">1.3. 要求者</h4>
        ${data.requestor} ${data.requestedOn}
        <h4 class="mb-0">1.4. 要求</h4>
        ${data.request}
        <h3>2. 機能仕様</h3>
        <h4 class="mb-0">2.1. 仕様作成者</h4>
        ${data.createdBy} ${data.createdOn}
        <h4 class="mb-0">2.2. 仕様</h4>
        ${data.specification}
        <h4 class="mb-0">2.3. リスクアセスメント</h4>
        ${data.riskAssessment}
        <h4 class="mb-0">2.4. 承認者</h4>
        ${data.approver} ${data.approved}
        <h3>3. テスト仕様</h3>
        <h4>3.1. 手動UAT</h4>
        <h5 class="mb-0">3.1.1. テスト作成および実施者</h5>
        ${data.testedBy}
        <h5 class="mb-0">3.1.2. テストスクリプト</h5>
        ${data.testScript}
        <h5 class="mb-0">3.1.3. 承認者</h5>
        ${data.approvedBy}
        <h4 class="mb-0">3.2. テストコード</h4>
        ${data.testCode}
        <h3 class="mb-0">4. 最終承認</h3>
        このチケットは完了し、${data.authoriser}よりリリースの承認を得ました。 ${data.finalApproved}
      </body>
    </html>`;
}
