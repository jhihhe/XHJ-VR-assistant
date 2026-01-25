// ==UserScript==
// @name         象视自动同步V1.70框架精确版
// @namespace    http://tampermonkey.net/
// @version      1.68
// @description  精确控制在指定框架中创建按钮，修复多框架重复创建问题
// @author       志哥
// @match        *://vr.xhj.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 配置：指定要在其中创建按钮的框架URL规则    
    const TARGET_FRAME_URLS = [
        'https://vr.xhj.com/houseadmin/house/index.html', // 取消注释并替换为实际框架URL
    ];

    const BUTTON_ID = 'auto-sync-button-v3';
    const SETTINGS_BUTTON_ID = 'auto-sync-settings-v3';
    let isRunning = false;

    // 判断当前是否为顶级窗口
    function isTopWindow() {
        return window === window.top;
    }

    // 判断当前是否在目标框架中
    function isInTargetFrame() {
        // 如果配置为空且是顶级窗口，返回true
        if (TARGET_FRAME_URLS.length === 0 && isTopWindow()) return true;
        
        // 检查当前框架URL是否匹配目标规则
        const frameUrl = window.location.href;
        return TARGET_FRAME_URLS.some(urlPattern => 
            frameUrl.includes(urlPattern)
        );
    }

    // 清理所有自动同步按钮
    function cleanupButtons() {
        document.querySelectorAll(`#${BUTTON_ID}, #${SETTINGS_BUTTON_ID}`).forEach(btn => btn.remove());
    }

    // 检查是否已存在按钮
    function hasButtons() {
        return document.getElementById(BUTTON_ID) !== null;
    }

    // 只在目标框架中创建按钮
    function initButtons() {
        if (!isInTargetFrame()) return;
        
        cleanupButtons();
        
        // 创建主按钮
        const triggerButton = document.createElement('button');
        triggerButton.id = BUTTON_ID;
        triggerButton.textContent = '开始自动同步';
        triggerButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 999999;
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
            min-width: 140px;
        `;
        triggerButton.addEventListener('click', clickSyncButtons);
        document.body.appendChild(triggerButton);
        
        // 创建设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.id = SETTINGS_BUTTON_ID;
        settingsButton.textContent = '跳转并指定90';
        settingsButton.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 999999;
            padding: 8px 16px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
            min-width: 60px;
        `;
        settingsButton.addEventListener('click', openSettings);
        document.body.appendChild(settingsButton);
    }

    // 监视DOM变化，确保只有一个按钮
    const observer = new MutationObserver((mutations) => {
        if (!isInTargetFrame()) return;
        
        // 如果发现多个按钮或没有按钮，重新初始化
        const buttonCount = document.querySelectorAll(`#${BUTTON_ID}, #${SETTINGS_BUTTON_ID}`).length;
        if (buttonCount !== 2) {
            initButtons();
        }
    });

    function findSyncButtons() {
        const buttons = new Set();
        const xpath = "//*[contains(text(),'同步') or contains(@value,'同步')]";
        const elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < elements.snapshotLength; i++) {
            const element = elements.snapshotItem(i);
            if (!element.id?.startsWith('auto-sync-button') && isClickable(element) && isVisible(element)) {
                buttons.add(element);
            }
        }
        return Array.from(buttons);
    }

    function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length) &&
            window.getComputedStyle(element).visibility !== 'hidden' &&
            window.getComputedStyle(element).display !== 'none';
    }

    function isClickable(element) {
        const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT'];
        return clickableTags.includes(element.tagName) ||
            element.onclick != null ||
            element.getAttribute('role') === 'button' ||
            window.getComputedStyle(element).cursor === 'pointer';
    }

    function updateButtonStatus(text, isProcessing = false) {
        const button = document.getElementById(BUTTON_ID);
        if (!button) return;
        button.textContent = text;
        button.style.backgroundColor = isProcessing ? '#ff9800' : '#4CAF50';
    }

    async function clickSyncButtons(e) {
        e.preventDefault();
        if (isRunning) return;
        isRunning = true;

        const buttons = findSyncButtons();
        let currentCount = 0;

        if (buttons.length === 0) {
            updateButtonStatus('未找到同步按钮');
            setTimeout(() => updateButtonStatus('开始自动同步'), 2000);
            isRunning = false;
            return;
        }

        for (const button of buttons) {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                button.click();
                currentCount++;
                updateButtonStatus(`正在同步(${currentCount}/${buttons.length})`, true);
            } catch (error) {
                console.error('点击按钮时发生错误:', error);
            }
        }

        updateButtonStatus(`完成同步 ${currentCount} 个`, true);
        setTimeout(() => {
            updateButtonStatus('开始自动同步');
            isRunning = false;
        }, 2000);
    }

    // 等待指定毫秒数的函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 等待元素出现的函数
    async function waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await delay(100);
        }
        throw new Error(`Element not found: ${selector}`);
    }

    async function openSettings() {
        try {
            //  激活标签
            const tabIcon = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > div > i");
            tabIcon.click();
            await delay(200);
            
            const orderTab = await waitForElement("body > div.admin-main.layui-anim.layui-anim-upbit > form > div > div:nth-child(2) > div > dl > dd:nth-child(5)");// 选择已接单
            orderTab.click();
            await delay(300);
            
            const searchButton = await waitForElement("#search");// 点击搜索
            searchButton.click();
            await delay(4000); // 等待搜索结果加载

            // 设置下拉框值并触发事件
            const select = await waitForElement("[id^='layui-laypage'] > span > select");
            select.value = "90";
            
            // 创建并触发change事件
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
            
            console.log("操作完成");
        } catch (error) {
            console.error("自动化操作失败:", error);
        }
    }

    // 主初始化函数，添加延迟确保框架加载完成
    function initialize() {
        // 延迟初始化，等待框架加载完成
        setTimeout(() => {
            if (isInTargetFrame()) {
                initButtons();
                
                // 启动观察器
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // 在页面卸载时断开观察器
                window.addEventListener('unload', () => observer.disconnect());
            }
        }, 500); // 调整延迟时间(毫秒)，根据实际页面加载情况调整
    }

    // 立即执行初始化
    initialize();
})();