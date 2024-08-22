// Set up dimensions and margins
const width = 800;
const height = 500;
const margin = { top: 20, right: 40, bottom: 60, left: 60 };

// Create SVG container
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Fetch data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
        // Parse the data
        data.forEach(d => {
            d.Year = new Date(d.Year, 0);
            d.Time = new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
        });

        // Set up scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleTime()
            .domain(d3.extent(data, d => d.Time))
            .range([height - margin.bottom, margin.top]);

        // Create axes
        const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));
        const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

        // Append x-axis
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        // Append y-axis
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis);

        // Create dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d.Time))
            .attr("r", 5)
            .attr("data-xvalue", d => d.Year.getFullYear())
            .attr("data-yvalue", d => d.Time)
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible")
                    .attr("data-year", d.Year.getFullYear())
                    .html(`Year: ${d.Year.getFullYear()}<br>Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>${d.Doping}`);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", `${event.pageY - 10}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("id", "tooltip");

        // Legend
        d3.select("#legend")
            .append("p")
            .text("Legend: Doping Allegations");
    });
