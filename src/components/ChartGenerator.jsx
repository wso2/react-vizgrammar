

import React from 'react';
import { VictoryLine, VictoryScatter, VictoryTooltip, VictoryArea, VictoryBar, VictoryPortal } from 'victory';

const DEFAULT_MARK_RADIUS = 4;
const DEFAULT_AREA_FILL_OPACITY = 0.1;

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
                        config.charts[chartIndex].style.fillOpacity || DEFAULT_AREA_FILL_OPACITY :
                        DEFAULT_AREA_FILL_OPACITY,
                },
            }}
        />);

    return ([
        chartElement,
        (
            <VictoryScatter
                labels={
                    d => `${config.x}:${Number(d.x).toFixed(2)}\n
                ${config.charts[chartIndex].y}:${Number(d.y).toFixed(2)}`
                }
                labelComponent={
                    <VictoryTooltip
                        orientation='right'
                        pointerLength={4}
                        cornerRadius={2}
                        flyoutStyle={{ fill: '#000', fillOpacity: '0.8', strokeWidth: 0 }}
                        style={{ fill: '#b0b0b0' }}
                    />
                }
                padding={{ left: 100, top: 30, bottom: 50, right: 30 }}
                size={(
                    config.charts[chartIndex].style ?
                        config.charts[chartIndex].style.markRadius || DEFAULT_MARK_RADIUS : DEFAULT_MARK_RADIUS
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

            />),
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
    );
}
