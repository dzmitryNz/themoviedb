import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { D3Service, D3, Selection } from 'd3-ng2-service';

import { GeneratorValueService } from '../../core/index';

@Component({
    selector: 'app-realtime-data',
    templateUrl: './realtime-data.component.html',
    styleUrls: ['./realtime-data.component.css']
})
export class RealtimeDataComponent implements OnInit, OnDestroy {
    private d3: D3;
    private parentNativeElement: any;
    private generatorValueService: GeneratorValueService;
    private randomValue: Observable<any>;
    private randomValueSubscription: Subscription;

    public d3ParentElement: Selection<any, any, any, any>;

    constructor(
        generatorValueService: GeneratorValueService,
        element: ElementRef,
        d3Service: D3Service
    ) {
        this.d3 = d3Service.getD3();
        this.parentNativeElement = element.nativeElement;
        this.generatorValueService = generatorValueService;
    }

    ngOnInit() {
        this.randomValue = this.generatorValueService.getArrayWithRandomValue();

        if (this.parentNativeElement !== null) {
            this.d3ParentElement = this.d3.select(this.parentNativeElement);
        }

        const d3 = this.d3;
        const margin = { top: 80, right: 100, bottom: 80, left: 80 };
        const height = 800 - margin.top - margin.bottom;
        const width = window.innerWidth - margin.left - margin.right;

        const svg = d3
            .select('.content')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + 2 * margin.left + ',' + margin.top + ')'
            )
            .attr('class', 'external-container');

        const innerContainer = d3
            .select('.external-container')
            .append('g')
            .attr('class', 'inner-container');

        this.randomValueSubscription = this.randomValue.subscribe(
            randomValue => {
                // Add new X coords
                const x = d3
                    .scaleLinear()
                    .domain([0, randomValue.length - 1])
                    .range([0, width]);

                // Add new Y coords
                const y = d3
                    .scaleLinear()
                    .domain([0, 1])
                    .range([height, 0]);

                // Add line
                const line = d3
                    .line()
                    // tslint:disable-next-line: variable-name
                    .x((_d, i) => x(i))
                    .y(d => y(d.value))
                    .curve(d3.curveMonotoneX);

                // Remove X coords
                innerContainer.select('.xAxis').remove();

                // Remove old Y coords
                svg.select('.yAxis').remove();

                // Move x to left on new value
                innerContainer.data(randomValue, (d, i) => {
                    return innerContainer.attr(
                        'transform',
                        'translate(-' + parseInt(margin.left + i) + ', 0)'
                    );
                });

                innerContainer
                    .append('g')
                    .attr('class', 'xAxis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(d3.axisBottom(x));

                svg.append('g')
                    .attr('class', 'yAxis')
                    .call(d3.axisLeft(y));

                // Remove old line
                svg.select('.path').remove();

                // Remove old dots
                svg.selectAll('.dot').remove();

                // Add new dots to char
                innerContainer
                    .selectAll('.dot')
                    .data(randomValue)
                    .enter()
                    .append('circle')
                    .attr('class', 'dot')
                    .attr('cx', function(d, i) {
                        return x(i);
                    })
                    .attr('cy', function(d) {
                        return y(d.value);
                    })
                    .attr('r', 3)
                    .attr('fill', '#ffab00');

                // Add new line from array
                innerContainer
                    .append('path')
                    .datum(randomValue)
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke', '#ffab00')
                    .attr('stroke-width', 1)
                    .attr('class', 'path');
            }
        );
    }

    ngOnDestroy() {
        this.randomValueSubscription.unsubscribe();
    }
}
