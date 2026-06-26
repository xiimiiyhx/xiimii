/**
 * 海洋危机 · 海狮之殇
 * 独立 ECharts 热力图 —— 基于 1996–2010 海洋生物观测数据
 * 展示渔网活动时空分布，警示海洋生态危机
 * 
 * 使用方式：
 * 1. 在 HTML 中引入 ECharts 5 核心库
 *    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
 * 2. 引入本脚本（或直接内联）
 * 3. 脚本会自动在 body 中创建容器并渲染图表
 */

(function () {
    'use strict';

    // ---------- 数据 ----------
    // 行：星期（周六 → 周日）  列：小时（12a → 11p）
    // 数值为危机强度（0–14），源于 CSV 观测记录聚合
    const hours = [
        '12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a', '10a', '11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'
    ];

    const days = [
        '星期六', '星期五', '星期四',
        '星期三', '星期二', '星期一', '星期日'
    ];

    // 原始热力数据 [dayIndex, hourIndex, value]
    const rawData = [
        [0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0],
        [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2],
        [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6],
        [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5],
        [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0],
        [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2],
        [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7],
        [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2],
        [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0],
        [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2],
        [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5],
        [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4],
        [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0],
        [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4],
        [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5],
        [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1],
        [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1],
        [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4],
        [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1],
        [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0],
        [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0],
        [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1],
        [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6],
        [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0],
        [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0],
        [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0],
        [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0],
        [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]
    ];

    // 转换为 ECharts 格式 [xIndex, yIndex, value]
    const heatData = rawData.map(function (item) {
        return [item[1], item[0], item[2] || '-'];
    });

    // ---------- 创建容器 & 注入样式 ----------
    function createContainer() {
        // 如果已有 #ocean-crisis-heatmap 则复用，否则新建
        let container = document.getElementById('ocean-crisis-heatmap');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ocean-crisis-heatmap';
            container.style.width = '100%';
            container.style.height = '560px';
            container.style.maxWidth = '1200px';
            container.style.margin = '0 auto';
            container.style.borderRadius = '28px';
            container.style.overflow = 'hidden';
            container.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6)';
            container.style.background = 'rgba(6, 22, 40, 0.75)';
            container.style.backdropFilter = 'blur(4px)';
            document.body.prepend(container);
        }
        return container;
    }

    function injectStyles() {
        const styleId = 'ocean-crisis-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 全局基础 */
            body {
                margin: 0;
                padding: 20px;
                background: linear-gradient(145deg, #0b1a2e 0%, #0e2a3f 45%, #1a3f5a 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Segoe UI', 'PingFang SC', system-ui, sans-serif;
            }
            /* 图表容器自适应 */
            #ocean-crisis-heatmap {
                width: 100%;
                height: 560px;
                max-width: 1200px;
                margin: 0 auto;
                border-radius: 28px;
                overflow: hidden;
                background: rgba(6, 22, 40, 0.75);
                backdrop-filter: blur(4px);
                box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            }
            @media (max-width: 700px) {
                #ocean-crisis-heatmap {
                    height: 420px;
                }
            }
            @media (max-width: 450px) {
                #ocean-crisis-heatmap {
                    height: 340px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ---------- 初始化图表 ----------
    function renderChart(dom) {
        // 确保 ECharts 已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts 未加载，请引入 ECharts 库（>=5.0）');
            return;
        }

        const chart = echarts.init(dom, 'dark', { renderer: 'canvas' });

        const option = {
            // 提示框
            tooltip: {
                position: 'top',
                backgroundColor: 'rgba(6, 22, 40, 0.92)',
                borderColor: 'rgba(64, 200, 255, 0.2)',
                borderWidth: 1,
                borderRadius: 12,
                padding: [12, 18],
                textStyle: {
                    color: '#c8e6f5',
                    fontSize: 13,
                    lineHeight: 1.6
                },
                formatter: function (params) {
                    const day = days[params.value[1]] || '';
                    const hour = hours[params.value[0]] || '';
                    const val = params.value[2];
                    let level = '低危';
                    let color = '#4a9fc5';
                    if (val > 10) { level = '极危 ⚠️';
                        color = '#d94f4f'; } 
                    else if (val > 7) { level = '高危';
                        color = '#f5b042'; } 
                    else if (val > 4) { level = '中危';
                        color = '#2a7faa'; }
                    return `
                        <div style="font-weight:600;font-size:15px;margin-bottom:6px;color:#7fd8ff;">
                            🐾 ${day} · ${hour}
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:28px;">
                            <span style="color:rgba(180,215,240,0.7);">危机强度</span>
                            <span style="font-weight:700;font-size:16px;color:${color};">
                                ${val} / 14
                            </span>
                        </div>
                        <div style="display:flex;justify-content:space-between;gap:28px;margin-top:2px;">
                            <span style="color:rgba(180,215,240,0.7);">风险等级</span>
                            <span style="font-weight:600;color:${color};">
                                ${level}
                            </span>
                        </div>
                        <div style="margin-top:8px;font-size:12px;color:rgba(160,200,230,0.4);border-top:1px solid rgba(64,200,255,0.06);padding-top:6px;">
                            ${val > 7 ? '⚠️ 渔网活动密集，海狮受困风险极高' : '🌊 相对安全，仍需警惕'}
                        </div>
                    `;
                }
            },

            // 网格
            grid: {
                left: '4%',
                right: '4%',
                top: '4%',
                bottom: '8%',
                containLabel: true
            },

            // X轴
            xAxis: {
                type: 'category',
                data: hours,
                splitArea: { show: true },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: 'rgba(160, 210, 240, 0.6)',
                    fontSize: 11,
                    fontWeight: 300,
                    interval: 0
                },
                splitLine: { show: false }
            },

            // Y轴
            yAxis: {
                type: 'category',
                data: days,
                splitArea: { show: true },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: 'rgba(160, 210, 240, 0.7)',
                    fontSize: 12,
                    fontWeight: 400
                },
                splitLine: { show: false }
            },

            // 视觉映射
            visualMap: {
                min: 0,
                max: 14,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '2%',
                width: '60%',
                height: 16,
                textStyle: {
                    color: 'rgba(180, 215, 240, 0.5)',
                    fontSize: 11,
                    fontWeight: 300
                },
                text: ['极危', '安全'],
                textGap: 20,
                inRange: {
                    color: [
                        '#0a2a44', // 0
                        '#0d3d5e', // 2
                        '#1a5f7a', // 4
                        '#2a7faa', // 6
                        '#4a9fc5', // 8
                        '#e8b84a', // 10
                        '#f5a042', // 12
                        '#d94f4f'  // 14
                    ]
                },
                itemWidth: 20,
                itemHeight: 12,
                borderColor: 'rgba(64, 200, 255, 0.1)',
                borderWidth: 0
            },

            // 系列
            series: [{
                name: '海洋危机强度',
                type: 'heatmap',
                data: heatData,
                label: {
                    show: true,
                    color: 'rgba(220, 240, 255, 0.75)',
                    fontSize: 10,
                    fontWeight: 500,
                    fontFamily: 'monospace',
                    formatter: function (params) {
                        const v = params.value[2];
                        if (v === '-') return '';
                        return v;
                    }
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 180, 255, 0.3)',
                        borderColor: '#7fd8ff',
                        borderWidth: 1.5
                    },
                    label: {
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 700
                    }
                },
                itemStyle: {
                    borderColor: 'rgba(6, 22, 40, 0.5)',
                    borderWidth: 1,
                    borderRadius: 3,
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 100, 200, 0.05)'
                },
                progressive: 1000,
                animationDuration: 800,
                animationEasing: 'cubicOut'
            }]
        };

        chart.setOption(option);

        // 响应式
        let resizeTimer;
        const resizeHandler = function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                chart.resize();
            }, 120);
        };
        window.addEventListener('resize', resizeHandler);

        // 移动端字体适配
        const mediaQuery = window.matchMedia('(max-width: 600px)');
        const mobileHandler = function () {
            const isMobile = mediaQuery.matches;
            chart.setOption({
                xAxis: {
                    axisLabel: {
                        fontSize: isMobile ? 8 : 11,
                        rotate: isMobile ? 45 : 0
                    }
                },
                yAxis: {
                    axisLabel: {
                        fontSize: isMobile ? 9 : 12
                    }
                },
                series: [{
                    label: {
                        fontSize: isMobile ? 7 : 10
                    }
                }]
            });
            chart.resize();
        };
        mediaQuery.addEventListener('change', mobileHandler);
        // 初始适配
        setTimeout(mobileHandler, 100);

        // 点击事件（可选）
        chart.on('click', function (params) {
            if (params.value && params.value.length === 3) {
                const day = days[params.value[1]] || '';
                const hour = hours[params.value[0]] || '';
                const val = params.value[2];
                console.log(`[海洋危机] ${day} ${hour} · 强度 ${val}/14`);
            }
        });

        console.log('🌊 海洋危机 · 海狮之殇 热力图已加载');
        console.log('📊 数据基于 1996–2010 海洋生物观测记录聚合');

        // 返回图表实例，便于外部控制
        return chart;
    }

    // ---------- 启动 ----------
    function init() {
        injectStyles();
        const container = createContainer();
        renderChart(container);
    }

    // 如果 DOM 已加载，立即执行；否则监听 DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();