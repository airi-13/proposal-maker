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

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function addSection(parent, heading, text) {
        const section = element("section", "doc-section");
        section.append(element("h2", "", heading));
        const paragraph = element("p", "", text);
        section.append(paragraph);
        parent.append(section);
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

        const cover = element("article", "document-page cover-page");
        cover.append(element("p", "doc-kicker", "COVER LETTER"));
        cover.append(element("p", "cover-date", today));
        cover.append(element("p", "cover-recipient", target));
        cover.append(element("h1", "cover-heading", purpose + "書類送付のご案内"));
        cover.append(element("p", "cover-body", [
            "拝啓",
            "貴社ますますご清栄のこととお慶び申し上げます。",
            "このたび、下記のとおり企画書をお送りいたします。ご確認のほど、よろしくお願い申し上げます。",
            "敬具"
        ].join("\n\n")));
        cover.append(element("p", "cover-sender", sender));
        cover.append(element("p", "cover-note",
            "記\n\n件名：" + title + "\n書類：企画書 1部\n\n以上"));

        const proposal = element("article", "document-page proposal-page");
        proposal.append(element("p", "doc-kicker", "企 画 書"));
        proposal.append(element("h1", "doc-title", title));
        proposal.append(element("p", "doc-meta",
            "企画区分：" + purpose + "\n提出先：" + target + "\n作成日：" + today + "\n作成者：" + sender));

        fields.forEach(function (item) {
            addSection(proposal, item[1], valueOf(item[0], item[2]));
        });

        preview.replaceChildren(cover, proposal);
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