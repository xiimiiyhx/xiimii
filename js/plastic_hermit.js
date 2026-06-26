// ============================================================
// 文件：plastic-crisis.js
// 功能：基于海洋塑料监测数据，绘制堆叠面积图，展示塑料碎片
//       年际变化，并强调寄居蟹面临的“壳替代”危机。
// 依赖：ECharts (需在 HTML 中提前引入)
// 容器：需存在 <div id="chart" style="width:100%;height:600px;"></div>
// ============================================================

(function() {
    // ---------- 数据准备 ----------
    // 从原始 CSV 中提取的年度代表性数据（单位为 件/km²）
    // 可根据实际需求替换为完整数据聚合结果
    const years = [2007, 2008, 2009, 2010, 2011, 2012, 2013];
    
    // CD1 ~ CD4 分别代表微型、小型、中型、大型塑料碎片
    const cd1 = [15506.45, 32472.93, 357243.0, 428395.48, 478350.99, 479454.64, 204626.19];
    const cd2 = [18552.36, 68218.32, 235383.27, 132757.97, 218841.55, 272776.24, 245286.25];
    const cd3 = [1107.6, 14348.5, 61233.0, 119370.62, 65028.35, 139777.75, 30937.0];
    const cd4 = [0, 0, 0, 0, 0, 0, 0];  // 原数据中此字段多为空，此处保留以展示结构

    // ---------- ECharts 配置 ----------
    const option = {
        title: {
            text: '海洋塑料碎片逐年堆积趋势',
            subtext: '数据来源：全球海洋塑料监测 (2007-2013) | 寄居蟹栖息地危机',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#1e3c5c'
            },
            subtextStyle: {
                fontSize: 13,
                color: '#b84a4a'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter: function(params) {
                let res = `<strong>年份 ${params[0].axisValue}</strong><br/>`;
                let total = 0;
                params.forEach(p => {
                    res += `${p.marker} ${p.seriesName}: ${p.value.toFixed(0)} 件/km²<br/>`;
                    total += p.value;
                });
                res += `<br/>⚠️ 塑料总密度: <strong>${total.toFixed(0)} 件/km²</strong><br/>`;
                res += `寄居蟹面临“壳”替代危机：塑料碎片增加，天然螺壳减少。`;
                return res;
            }
        },
        legend: {
            data: ['微型塑料 (CD1)', '小型塑料 (CD2)', '中型塑料 (CD3)', '大型塑料 (CD4)'],
            top: 70,
            left: 'center',
            icon: 'roundRect',
            itemWidth: 20,
            itemHeight: 10
        },
        grid: {
            left: '6%',
            right: '6%',
            bottom: '10%',
            top: '25%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: years,
            axisLabel: { fontSize: 14, fontWeight: '500' },
            axisLine: { lineStyle: { color: '#3b5f7a' } }
        },
        yAxis: {
            type: 'value',
            name: '碎片密度 (件 / km²)',
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: { fontSize: 14, fontWeight: '500', color: '#1e3c5c' },
            splitLine: { lineStyle: { type: 'dashed', color: '#d7e0e8' } },
            axisLabel: {
                formatter: function(value) {
                    if (value >= 1000) return (value/1000).toFixed(0) + 'k';
                    return value;
                }
            }
        },
        series: [
            {
                name: '微型塑料 (CD1)',
                type: 'line',
                stack: 'Total',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#4f8bc9' },
                        { offset: 1, color: '#b3d4f0' }
                    ])
                },
                lineStyle: { color: '#2a5f8a', width: 2 },
                emphasis: { focus: 'series' },
                data: cd1
            },
            {
                name: '小型塑料 (CD2)',
                type: 'line',
                stack: 'Total',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#e67e22' },
                        { offset: 1, color: '#f5cba0' }
                    ])
                },
                lineStyle: { color: '#d35400', width: 2 },
                emphasis: { focus: 'series' },
                data: cd2
            },
            {
                name: '中型塑料 (CD3)',
                type: 'line',
                stack: 'Total',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#27ae60' },
                        { offset: 1, color: '#a9dfbf' }
                    ])
                },
                lineStyle: { color: '#1e8449', width: 2 },
                emphasis: { focus: 'series' },
                data: cd3
            },
            {
                name: '大型塑料 (CD4)',
                type: 'line',
                stack: 'Total',
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#c0392b' },
                        { offset: 1, color: '#f5b7b1' }
                    ])
                },
                lineStyle: { color: '#922b21', width: 2 },
                emphasis: { focus: 'series' },
                data: cd4,
                // 大型塑料对寄居蟹威胁最大，加入标记和阈值线
                markPoint: {
                    data: [
                        { type: 'max', name: '峰值危机' },
                        { type: 'min', name: '最低值' }
                    ],
                    symbol: 'pin',
                    symbolSize: 50,
                    itemStyle: { color: '#c0392b' },
                    label: {
                        formatter: function(params) {
                            if (params.type === 'max') return '⚠️ 高危机';
                            return '低值';
                        },
                        fontSize: 12,
                        color: '#fff'
                    }
                },
                markLine: {
                    silent: true,
                    data: [
                        { yAxis: 100000, name: '生态威胁阈值' }
                    ],
                    lineStyle: { color: '#b03a2e', type: 'dashed', width: 2 },
                    label: {
                        formatter: '寄居蟹耐受上限',
                        fontSize: 12,
                        color: '#b03a2e',
                        position: 'insideEndTop'
                    }
                }
            }
        ],
        backgroundColor: '#fafcfe',
        animationDuration: 1500,
        animationEasing: 'cubicOut'
    };

    // ---------- 初始化图表 ----------
    // 确保 DOM 加载完成后再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChart);
    } else {
        initChart();
    }

    function initChart() {
        const chartDom = document.getElementById('chart');
        if (!chartDom) {
            console.error('未找到 id="chart" 的容器，请确保在 HTML 中存在该元素。');
            return;
        }
        const myChart = echarts.init(chartDom);
        myChart.setOption(option);

        // 窗口自适应
        window.addEventListener('resize', function() {
            myChart.resize();
        });

        // 点击交互（可扩展）
        myChart.on('click', function(params) {
            if (params.componentType === 'series') {
                alert(`📊 ${params.name} 年\n${params.seriesName}: ${params.value.toFixed(0)} 件/km²\n\n⚠️ 该数值反映当年海洋塑料污染程度，直接影响寄居蟹的栖息地质量。`);
            }
        });
    }
})();