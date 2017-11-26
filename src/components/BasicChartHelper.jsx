import React from 'react';
import { VictoryLine, VictoryPortal, VictoryScatter, VictoryTooltip, VictoryArea, VictoryBar } from 'victory';

export function generateLineOrAreaChartComponent(config, chartIndex, onClick) {

    const chartElement = config.charts[chartIndex].type === 'line' ?
        (<VictoryLine
            style={{
                data: {
                    strokeWidth: config.charts[chartIndex].style ?
                        config.charts[chartIndex].style.strokeWidth || null : null,
                },
            }}
        />) :
        (<VictoryArea
            style={{
                data: {
                    fillOpacity: config.charts[chartIndex].style ?
                        config.charts[chartIndex].style.fillOpacity || 0.1 : 0.1,
                },
            }}
        />);

    return ([
        chartElement,
        (<VictoryPortal>
            <VictoryScatter
                labels={
                    d => `${config.x}:${Number(d.x).toFixed(2)}\n
                ${config.charts[chartIndex].y}:${Number(d.y).toFixed(2)}`
                }
                labelComponent={
                    <VictoryTooltip
                        orientation='top'
                        pointerLength={4}
                        cornerRadius={2}
                        flyoutStyle={{ fill: '#000', fillOpacity: '0.8', strokeWidth: 0 }}
                        style={{ fill: '#b0b0b0' }}
                    />
                }
                size={(
                    config.charts[chartIndex].style ?
                        config.charts[chartIndex].style.markRadius || 4 :
                        4
                )}
                events={[{
                    target: 'data',
                    eventHandlers: {
                        onClick: () => {
                            return [
                                {
                                    target: 'data',
                                    mutation: onClick,
                                },
                            ];
                        },
                    },
                }]}

            />
        </VictoryPortal>),
    ]);
}

export function generateBarChartComponent(config, chartIndex, data, color, onClick) {
    return (
        <VictoryBar
            labels={d => `${config.x}:${d.x}\n${config.charts[chartIndex].y}:${d.y}`}
            labelComponent={
                <VictoryTooltip
                    orientation='top'
                    pointerLength={4}
                    cornerRadius={2}
                    flyoutStyle={{ fill: '#000', fillOpacity: '0.8', strokeWidth: 0 }}
                    style={{ fill: '#b0b0b0' }}
                />
            }
            data={data}
            color={color}
            events={[{
                target: 'data',
                eventHandlers: {
                    onClick: () => {
                        return [
                            {
                                target: 'data',
                                mutation: onClick,
                            },
                        ];
                    },
                },
            }]}
        />
    )
}
