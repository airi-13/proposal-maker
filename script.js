document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const fields = [
        ["p-market", "市場分析（ターゲット・市場規模）", "市場・ターゲットに関する情報を入力してください。"],
        ["p-competitor", "競合分析", "競合状況や差別化のポイントを入力してください。"],
        ["p-strength", "自社の強み", "自社の強みと、相手の課題解決につながる点を入力してください。"],
        ["p-why", "背景・理由（WHY）", "この企画を実施する背景・理由を入力してください。"],
        ["p-what", "企画内容（WHAT / WHEN / WHERE）", "何を、いつ、どこで行うかを入力してください。"],
        ["p-how", "実施内容・体制（HOW / WHO）", "実施方法、担当者、運営体制を入力してください。"],
        ["p-effect", "期待される効果", "企画によって期待できる効果を入力してください。"]
    ];

    function valueOf(id, fallback) {
        const field = document.getElementById(id);
        return field && field.value.trim() ? field.value.trim() : fallback;
    }

    // 入力値はHTMLとして解釈せず、必ずtextContentで挿入する。
    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function addSection(parent, heading, text) {
        const section = element("section", "doc-section");
        section.append(element("h2", "", heading));
        section.append(element("p", "", text));
        parent.append(section);
    }

    function addBlankArea(parent, label, className) {
        const group = element("section", "management-field");
        group.append(element("h3", "", label));
        group.append(element("div", "handwriting-area " + (className || "")));
        parent.append(group);
    }

    function generatePreview() {
        const preview = document.getElementById("preview-area");
        if (!preview) return;

        const purpose = valueOf("p-purpose", "提案");
        const target = valueOf("p-target", "（提出先・想定読者）");
        const title = valueOf("p-title", "（企画書タイトル）");
        const sender = valueOf("p-sender", "（自社名・担当者名）");
        const today = new Intl.DateTimeFormat("ja-JP", {
            year: "numeric", month: "long", day: "numeric"
        }).format(new Date());

        // 1. 送付状
        const cover = element("article", "document-page cover-page");
        cover.append(element("p", "doc-kicker", "COVER LETTER"));
        cover.append(element("p", "cover-date", today));
        cover.append(element("p", "cover-recipient", target));
        cover.append(element("h1", "cover-heading", "書類送付のご案内"));
        cover.append(element("p", "cover-body", [
            "拝啓",
            "貴社ますますご清栄のこととお慶び申し上げます。",
            "平素は格別のお引き立てを賜り、厚く御礼申し上げます。",
            "さて、このたび「" + purpose + "」を目的とした企画書を作成いたしましたので、下記のとおりご送付申し上げます。",
            "ご査収のほど、何卒よろしくお願い申し上げます。",
            "敬具"
        ].join("\n\n")));
        cover.append(element("p", "cover-sender", sender));
        cover.append(element("p", "cover-note",
            "記\n\n1. 企画書：「" + title + "」 1部\n\n以上"));

        // 2. 企画書本体
        const proposal = element("article", "document-page proposal-page");
        proposal.append(element("p", "doc-kicker", "企 画 書"));
        proposal.append(element("h1", "doc-title", title));
        proposal.append(element("p", "doc-meta",
            "企画区分：" + purpose + "\n提出先：" + target + "\n作成日：" + today + "\n作成者：" + sender));

        fields.forEach(function (item) {
            addSection(proposal, item[1], valueOf(item[0], item[2]));
        });

        // 3. 送付後アクション・管理シート（社内用）
        const management = element("article", "document-page management-page");
        management.append(element("p", "doc-kicker", "INTERNAL FOLLOW-UP"));
        management.append(element("h1", "doc-title", "送付後アクション・管理シート"));
        management.append(element("p", "management-notice", "社内用・送付後の対応記録"));

        const summary = element("section", "management-summary");
        summary.append(element("h2", "", "対象企画案件"));
        const summaryList = element("dl", "management-details");
        [
            ["提出先", target],
            ["企画タイトル", title],
            ["企画区分", purpose],
            ["送付日", today],
            ["送付元", sender]
        ].forEach(function (pair) {
            summaryList.append(element("dt", "", pair[0]));
            summaryList.append(element("dd", "", pair[1]));
        });
        summary.append(summaryList);
        management.append(summary);

        const followup = element("section", "management-checklist");
        followup.append(element("h2", "", "11. フォローアップ・チェックリスト"));
        [
            "資料送付後の挨拶（電話・メール）を実施した",
            "企画の概要を30秒〜1分程度で説明した",
            "先方の確認状況を確認・リマインドした",
            "先方からの質問・要望に対応した"
        ].forEach(function (label) {
            const row = element("p", "checklist-item");
            row.append(element("span", "check-box", "□"));
            row.append(element("span", "", label));
            followup.append(row);
        });
        management.append(followup);

        const progress = element("section", "management-progress");
        progress.append(element("h2", "", "12. 送付企画書の進捗管理"));
        addBlankArea(progress, "反応・フィードバック", "feedback-area");
        addBlankArea(progress, "次回アクション・問い合わせ内容", "next-action-area");
        addBlankArea(progress, "対応担当者・対応予定日", "owner-area");
        management.append(progress);

        // replaceChildrenにより、再描画時に古いプレビューを残さない。
        preview.replaceChildren(cover, proposal, management);
    }

    const form = document.getElementById("proposal-form");
    if (form) {
        form.addEventListener("input", generatePreview);
        form.addEventListener("change", generatePreview);
        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    generatePreview();
});
