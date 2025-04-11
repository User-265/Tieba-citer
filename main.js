// ==UserScript==
// @name         贴吧引用
// @namespace    http://tampermonkey.net/
// @version      1.2.2025.4.11
// @description  按 标题\n作者\n链接\n时间 的格式复制贴子信息
// @author       User-265 assisted by deepseek
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// ==/UserScript==

(function() {
    // 检查URL条件
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.has('pn') && urlParams.get('pn') !== '1') return;

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .quote-btn {
            transition: all 0.2s ease;
            color: white;
            background: #3485FB;
        }
        .quote-btn:hover {
            background: #265265;
            transform: translateY(-2px);
        }
        .quote-btn:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '引用';

    // 插入按钮
    const targetA = document.querySelector('a#lzonly_cntn');
    if(targetA.parentNode.nodeName == 'SPAN'){
        const container = document.createElement('a');
        btn.className = 'quote-btn btn-sub btn-small';
        container.appendChild(btn);
        targetA.parentNode.insertBefore(container, targetA)
    }
    else{
        const container = document.createElement('li');
        titleElement = document.querySelector('h1.core_title_txt');
        titleElement.setAttribute('style','width: 400px')
        btn.className = 'quote-btn l_lzonly d_lzonly_bdaside';
        container.appendChild(btn);
        targetA.parentNode.parentNode.insertBefore(container, targetA.parentNode)
    }

    // 点击事件
    btn.addEventListener('click', function() {
        // 添加点击反馈
        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);

        // 数据获取
        // nmd贴吧的贴为什么会有两种不同的格式啊#(喷)
        const title1 = document.querySelector('h1.core_title_txt')?.title || '';
        const title2 = document.querySelector('h3.core_title_txt')?.title || '';
        const link = location.href.split('?')[0];
        const authorElem = document.querySelector('ul.p_author li.d_name a');
        let authorname = authorElem?.textContent?.trim() || '';
        const timeElem1 = document.querySelector('ul.p_tail li:nth-child(2) span');
        const timeElem2 = document.querySelector('div.post-tail-wrap span:nth-child(6)');
        const time1 = timeElem1?.textContent?.trim() || '';
        const time2 = timeElem2?.textContent?.trim() || '';

        const output = `${title1}${title2}
${link}
${authorname}
${time1}${time2}`;

        navigator.clipboard.writeText(output)
            .then(() => {
                const originalText = this.textContent;
                this.textContent = '✓ 已复制';
                setTimeout(() => { this.textContent = originalText; }, 1500);
            })
            .catch(() => alert('复制失败，请手动复制'));
    });
})();
