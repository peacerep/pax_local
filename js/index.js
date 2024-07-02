//adapt to screen
let header_height = $("#header").height()
let screen_height = window.innerHeight;
let screen_width = window.innerWidth;
let screen_width30 = screen_width * 0.3;
let details_height = screen_height - header_height;

let adjust_zoom, circle_size;

if (screen_width <= 1450) {
    adjust_zoom = 2.2;
    circle_size = 6;
}
else if (screen_width <= 1024) {
    adjust_zoom = 2;
    circle_size = 5;
}
else {
    adjust_zoom = 2.5;
    circle_size = 7;
}

const margin = { top: 10, right: 20, bottom: 10, left: 20 },
    width = screen_width30 - margin.left - margin.right,
    height = (details_height - 50) * 0.45 - margin.top - margin.bottom;

//adjust height and width
d3.selectAll("#peace_process, #info")
    // .style("height", details_height + "px")
    .style("width", screen_width30 + "px")
    .style("right", - screen_width30 + "px")
d3.selectAll("#filters")
    // .style("height", details_height - 35 + "px")
    .style("width", screen_width * 0.2 + "px")
    .style("left", - (screen_width * 0.2 + 20) + "px")
d3.select("#info_content").style("height", details_height - 90 + "px")
d3.selectAll(".third")
    .style("height", (details_height - 90) * 0.45 + "px")
d3.select("#links")
    .style("height", details_height * 0.11 + "px")
d3.select("#chart").style("left", screen_width30 + "px")
// d3.selectAll(".filter_local").style("height", details_height / 5 - 22 + "px")
d3.selectAll("#main_timeline").style("height", details_height - (details_height / 5) - 110 + "px")
d3.select("#codebook")
    .style("width", screen_width * 0.4 + "px")
    .style("right", - screen_width * 0.4 + "px")

d3.select("iframe").style("width", screen_width * 0.4 + "px")
    .style("height", details_height + "px")


const stable_height = (details_height - 16) * 0.45;
const parseTime = d3.timeParse("%Y-%m-%d");

//main timeline svg
let main_timeline = d3.select("#main_timeline")
    .append("svg")
    .attr("id", "svg")
    .attr("width", screen_width * 0.18 + "px")
    .attr("height", details_height - (details_height / 5) - 110 + "px")
    .append("g")
    .attr("transform", `translate(${30},${0})`);
// main X axis
var main_x = d3.scaleLinear()
    .domain([0, 70])
    .range([5, screen_width * 0.15]);

// messy svg
let messy_svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", screen_width30 - 10)
    .attr("height", height)
messy_svg.append("g")
    .attr("class", "xAxis")

// initial data for messy timeline
let sequence = [
    { "key": "Cea", "name": ["Ceasefire", "related"], "color": d3.rgb(241, 80, 31, .8), 'position': 5 },
    { "key": "Pre", "name": ["Pre-negotiation", "process"], "color": d3.rgb(251, 173, 68, .8), 'position': 4 },
    { "key": "SubPar", "name": ["Partial", "Framework-substantive"], "color": d3.rgb(252, 202, 70, .8), 'position': 3 },
    { "key": "SubComp", "name": ["Comprehensive", "Framework-substantive"], "color": d3.rgb(172, 176, 140, .8), 'position': 2 },
    { "key": "Imp", "name": ["Implementation", "Renegotiation/Renewal"], "color": d3.rgb(74, 144, 226, .8), 'position': 1 },
    { "key": "Ren", "name": [], "color": d3.rgb(74, 144, 226, 8), 'position': 1 },
]

//scales & axes for messy timeline
let scaleColor = d3.scaleLinear()
    .domain([-350, 0, 350])
    .range([d3.rgb("#0075FF"), d3.rgb("#555555"), d3.rgb("#FF3B00")])
let scaleY = d3.scaleLinear()
    .domain(d3.extent(sequence, d => d.position))
    .range([20, height - 20])
let scaleX = d3.scaleTime()
    .range([5, width - 15])


// append beeswarm svg
const svg = d3.select("#timeline")
    .append("svg")
    .attr("width", screen_width30 - 8)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
svg.append("g")
    .attr("class", "myXaxis")
svg.append("g")
    .attr("class", "myYaxis")

//scales & axes for beeswarm timeline
const x_scale = d3.scaleTime()
    .range([0, width])
const y = d3.scaleLinear()
    .domain([0, 5])
    .range([height, 0]);


let simulation = d3.forceSimulation()
    .force("x", d3.forceX(function (d) { return x_scale(d[1][0][0]); }).strength(3))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(8))
    .stop();


// switching between beeswarm and messy
let counter_timeline = 0;
d3.select("#bee_time_btn").on("click", function () {
    counter_timeline += 1;
    if (counter_timeline % 2 !== 0) {
        d3.select("#timeline").transition().style("left", screen_width30 + "px")
        d3.select("#chart").transition().style("left", "0px")
    }
    else {
        d3.select("#timeline").transition().style("left", "0px")
        d3.select("#chart").style("left", screen_width30 + "px")
    }
})

// filters dis/appear
let counter = 0;
let counter_collab = 0;
let code_counter = 0;
d3.select("#filter_button").on("click", function () {
    counter += 1;
    if (counter % 2 !== 0) {
        d3.select("#filter_button")
            .transition().duration(500)
            .style("left", (screen_width * 0.2 + 8) + "px")
            // .style("background-color", "#AA4197")
            .text("Hide")
        d3.select("#filters")
            .transition().duration(500)
            .style("left", 5 + "px")
    }
    else {
        d3.select("#filters")
            .transition().duration(500)
            .style("left", - (screen_width * 0.2 + 20) + "px")
        d3.select("#filter_button")
            .transition().duration(500)
            .style("left", 0 + "px")
            // .style("background-color", "#DD1C33")
            .text("Filter")
    }
})

// info button dis/appear
d3.select("#info_button").on("click", function () {
    counter_collab += 1;
    d3.select("#peace_process")
        .transition().duration(800)
        .style("right", - screen_width * 0.30 + "px")
    d3.select("#codebook")
        .transition().duration(800)
        .style("right", - screen_width * 0.40 + "px")
    code_counter = 0
    if (counter_collab % 2 !== 0) {
        d3.select("#info")
            .transition().duration(500)
            .style("right", 5 + "px")
    }
    else {
        d3.select("#info")
            .transition().duration(500)
            .style("right", - screen_width * 0.30 + "px")
    }
})

// code button dis/appear
d3.select("#code_button").on("click", function () {
    console.log("gere");
    code_counter += 1;
    d3.selectAll("#peace_process, #info")
        .transition().duration(800)
        .style("right", - screen_width * 0.3 + "px")
    counter_collab = 0
    if (code_counter % 2 !== 0) {
        d3.select("#codebook")
            .transition().duration(500)
            .style("right", 5 + "px")
    }
    else {
        d3.select("#codebook")
            .transition().duration(500)
            .style("right", - screen_width * 0.4 + "px")
    }
})


// load mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FzaGFnYXJpYmFsZHkiLCJhIjoiY2xyajRlczBlMDhqMTJpcXF3dHJhdTVsNyJ9.P_6mX_qbcbxLDS1o_SxpFg';
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/dark-v11',
    // style: 'mapbox://styles/sashagaribaldy/cls4l3gpq003k01r0fc2s04tv',
    style: 'mapbox://styles/sashagaribaldy/clxstrxes00qv01pf8dgl4o20',
    center: [40.137343, 25.137451],
    zoom: adjust_zoom,
    attributionControl: false,
    logoPosition: "bottom-right"
});

$('#box1').click(function () {
    window.open($(this).find('a:first').attr('href'));
    return false;
});
$('#box2').click(function () {
    window.open($(this).find('a:first').attr('href'));
    return false;
});
$('#box3').click(function () {
    window.open($(this).find('a:first').attr('href'));
    return false;
});
$('#box4').click(function () {
    window.open($(this).find('a:first').attr('href'));
    return false;
});


// load the data
Promise.all([
    d3.csv("data/local_v8_1.csv"),
]).then(function (files) {
    let pax = files[0]
    console.log(pax);
    //Filter & Sort agreement data
    pax = pax.filter((d, i) => d.Stage !== "Oth")
    pax.sort(function (a, b) {
        function getDate(d) { return parseTime(d.Dat) }
        return getDate(a) - getDate(b)
    })

    //Create Objects for Agreements in the same process
    var messy_data = {
        "ideal": [
            { "Dat": "1990-01-01", "PPName": "ideal", "Stage": "Cea" },
            { "Dat": "1998-01-01", "PPName": "ideal", "Stage": "Pre" },
            { "Dat": "2006-01-01", "PPName": "ideal", "Stage": "SubPar" },
            { "Dat": "2014-01-01", "PPName": "ideal", "Stage": "SubComp" },
            { "Dat": "2022-01-01", "PPName": "ideal", "Stage": "Ren" },
            { "Dat": "2023-01-01", "PPName": "ideal", "Stage": "Ren" }]
    }

    pax.forEach(function (agreement) {
        if (typeof sequence.find(x => x.key == agreement.Stage) !== 'undefined') sequence.find(x => x.key == agreement.Stage).count++
        var name = agreement["PPName"]
        if (typeof messy_data[name] === 'undefined') messy_data[name] = []
        messy_data[name].push(agreement)
    })

    //clean location names and add description
    let raw_data = files[0]
    raw_data.forEach(function (o) {
        o.date = o.Dat.replace(/\//g, '-')
        o.date = parseTime(o.date)
    })

    //construct unique country array
    let country_array = []
    raw_data.forEach((d) => {
        if (country_array.includes(d.Con) == false) {
            country_array.push(d.Con)
        }
    })
    //constructing geojson
    let local_conflict_geojson = []
    raw_data.forEach(function (d) {
        let to_push = {
            'type': 'Feature',
            'properties': {
                'id': d.AgtId,
                'p_process': d.PPName,
                'year': d.year,
                'text': d.LocaleName,
                'stage': d.stage_label,
                'description': d.description,
                'agreement': d.Agt,
                'datum': d.Dat,
                'national': d.LinkNatProcess,
                'rit': d.RitPray,
                'grieve': d.Grieve,
                'cattle': d.Cattle,
                'cover': d.Cover,
                'link': d.PDF_Hyperlink,
                'link1': d.PAX_Hyperlink,
                'link2': d.PAX_Local_Hyperlink,
                'link3': d.local_search
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [d.LongDec, d.LatDec]
            }
        }
        local_conflict_geojson.push(to_push)
    })

    const geojson_data = {
        'type': 'FeatureCollection',
        'features': local_conflict_geojson
    };

    let main_timeline_year_group = d3.groups(raw_data, d => d.year)

    // y axis for main timeline 
    var main_y = d3.scaleBand()
        .range([0, details_height - (details_height / 5) - 110])
        .domain(main_timeline_year_group.map(function (d) { return d[0]; }))
        .padding(0.2);

    let hoveredPolygonId = null;
    //draw polygons
    map.on('load', () => {
        // Add a data source containing GeoJSON data.
        map.addSource('states', {
            'type': 'geojson',
            'data': geojson_data,
            'generateId': true //This ensures that all features have unique IDs
        });
        //circles for agreements
        map.addLayer(
            {
                'id': 'population',
                'type': 'circle',
                'source': 'states',
                'paint': {
                    "circle-opacity": 0.8,
                    "circle-stroke-width": 1.5,
                    'circle-radius': circle_size,
                    "circle-stroke-color":
                        [
                            'case',
                            ['boolean', ['feature-state', 'click'], false],
                            'white',
                            'black'
                        ],
                    'circle-color':
                        [
                            'match',
                            ['get', 'stage'],
                            'Pre-negotiation',
                            '#016099',
                            'Ceasefire',
                            '#df1f36',
                            'Framework-substantive, partial',
                            '#fd8189',
                            'Implementation',
                            '#3aae2a',
                            'Renewal',
                            '#fd8189',
                            'Other',
                            '#34495e',
                            'gray'
                        ]
                }
            },
        );

        map.on('click', 'population', (e, i) => {
            if (e.features.length > 0) {
                if (hoveredPolygonId !== null) {
                    map.setFeatureState(
                        { source: 'states', id: hoveredPolygonId },
                        { click: false }
                    );
                }
                hoveredPolygonId = e.features[0].id;
                map.setFeatureState(
                    { source: 'states', id: hoveredPolygonId },
                    { click: true }
                );
            }
            d3.select("#description")
                .style("display", "none")

            map.flyTo({ center: [e.lngLat.lng + 5, e.lngLat.lat], zoom: 5 });

            const description = e.features[0].properties
            d3.select("#peace_process")
                .transition().duration(800)
                .style("right", 3 + "px")
            d3.select("#info")
                .transition().duration(500)
                .style("right", - screen_width * 0.30 + "px")
            counter_collab = 0;

            d3.select("#peace_title")
                .html(description.p_process)
            d3.select("#process_stage")
                .html(`<h5 style="text-align: left;">Stage of Process: </h5>` + `<p>` + description.stage + `</p>`)
            d3.select("#agreement")
                .html(`<h5 style="text-align: left;">Agreement: </h5>` + `<p>` + description.agreement + ` (` + description.datum + `)` + `</p>`)
            d3.select("#locale")
                .html(`<h5 style="text-align: left;">Locale: </h5>` + `<p>` + description.text + `</p>`)
            d3.select("#desc")
                .html(`<h5 style="text-align: left;">Description: </h5>` + `<p>` + description.description + `</p>`)

            $("#linkie").attr('href', description.link);
            $("#linkie1").attr('href', description.link1);
            $("#linkie2").attr('href', description.link2);
            $("#linkie3").attr('href', description.link3);

            let reduce_height = $("#peace_title").height() + 21;
            let img_height = $(".box").height() - 40;
            d3.select("#peace_title_div").style("height", stable_height - reduce_height + "px")
            d3.selectAll("#first_img, #second_img, #third_img, #four_img")
                .style("height", img_height + "px")
            d3.selectAll("#krava")
                .style("top", 10 + "px")

            // beeswarm timeline
            let peace_instance = d3.groups(raw_data, function (r) {
                return r.PPName == description.p_process
            })
            let true_data;
            if (peace_instance[0][0] == true) {
                true_data = peace_instance[0][1]
            }
            else {
                true_data = peace_instance[1][1]
            }
            let peace_data = true_data;
            function sortByDateAscending(a, b) {
                return a.date - b.date;
            }
            let the_data = peace_data.sort(sortByDateAscending);
            let year_division = d3.groups(the_data, d => d.AgtId, d => d.date)
            x_scale.domain(d3.extent(year_division, function (d) { return d[1][0][0]; }))
                .nice();
            simulation.nodes(year_division)
            simulation.alpha(1).restart().tick();
            for (var i = 0; i < 200; ++i) { simulation.tick(); }
            const delaunay = d3.Delaunay.from(year_division, d => d.x, d => d.y),
                voronoi = delaunay.voronoi([0, 0, width, height]);

            //drawing x axis for beeswarm
            svg.selectAll(".myXaxis").transition().duration(500)
                .attr("transform", "translate(10," + (height - 20) + ")")
                .call(d3.axisBottom(x_scale).tickFormat(d3.timeFormat("%Y")).tickSize(-height).ticks(5))
                .style("stroke-dasharray", "5 5")
                .selectAll("text")
                .attr("transform", "translate(0,-4)")
                .style("fill", "white")
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-family", "Montserrat");

            //drawing circles for beeswarm
            svg.selectAll('.my_circles')
                .data(year_division)
                .join('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr("class", "my_circles")
                .attr('r', function (d) {
                    return 7
                })
                .style('fill', function (d) {
                    let color_choice;
                    switch (d[1][0][1][0].stage_label) {
                        case "Pre-negotiation":
                            color_choice = '#016099'
                            break;
                        case "Ceasefire":
                            color_choice = '#df1f36'
                            break;
                        case "Framework-substantive, partial":
                            color_choice = '#fd8189'
                            break;
                        case "Implementation":
                            color_choice = '#3aae2a'
                            break;
                        case "Renewal":
                            color_choice = '#fd8189'
                            break;
                        case "Other":
                            color_choice = '#34495e'
                            break;
                        default:
                            color_choice = 'gray'
                    }
                    return color_choice
                })
                .style('stroke', function (d) {
                    if (d[1][0][1][0].AgtId == description.id) {
                        return "white"
                    }
                    else {
                        return "none"
                    }
                })
                .style("cursor", "pointer")
                .style('stroke-width', 2)
                .on("mouseover", function (d, i) {
                    console.log(i[1][0][1][0]);
                    d3.select("#timeline_description")
                        .style("display", "block")
                        .style("left", d.x - 160 + "px")
                        .style("top", d.y - 20 + "px")
                        .html(i[1][0][1][0].Agt + ` (` + i[1][0][1][0].Dat + `)`)
                })
                .on("mouseleave", function (d, i) {
                    d3.select("#timeline_description")
                        .style("display", "none")
                })

            //messy timeline
            d3.selectAll(".messy_path, .stage_lines, .lines, .circles").remove()
            let individual_peace_process_name = description.p_process
            let peace_process_data = {
                [individual_peace_process_name]: messy_data[individual_peace_process_name]
            }
            let year_array = messy_data[individual_peace_process_name]
            let start_year = year_array[0].Dat
            let end_year = year_array[year_array.length - 1].Dat
            scaleX.domain([parseTime(start_year), parseTime(end_year)])

            messy_svg.selectAll(".xAxis").transition().duration(500)
                .attr("transform", "translate(10," + (height - 20) + ")")
                .call(d3.axisBottom(scaleX).tickFormat(d3.timeFormat("%Y")).ticks(5))
                .selectAll("text")
                .attr("transform", "translate(0,0)")
                .style("fill", "white")
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-family", "Montserrat");

            //legend lines
            messy_svg.append("g")
                .attr("class", "stage_lines")
                .selectAll("g")
                .data(sequence)
                .join("line")
                .attr("y1", d => scaleY(d.position))
                .attr("y2", d => scaleY(d.position))
                .attr("stroke", "white")
                .attr("stroke-width", 0.5)
                .attr("stroke-dasharray", "5 5")
                .attr("opacity", 0.3)
                .attr("x1", 10)
                .attr("x2", width)

            //legend
            messy_svg.append("g")
                .attr("class", "lines")
                .selectAll("g")
                .data(sequence)
                .join("text")
                .attr("y", d => scaleY(d.position) - 10)
                .attr("font-size", "10px")
                .attr("text-anchor", "end")
                .text(function (d) {
                    if (d.key !== "Ren") {
                        if (d.key == "SubComp") {
                            return "Com"
                        }
                        else if (d.key == "SubPar") {
                            return "Par"
                        }
                        else {
                            return d.key
                        }
                    }
                })
                .attr("fill", "white")
                .attr("x", width + 25)
                .attr("dy", "10pt")

            //compute line segments
            let segment = function (d, i, scale) {
                if (i < peace_process_data[d.PPName].length - 1) {
                    var start = {
                        "x": Math.round(scale(parseTime(d.Dat))),
                        "y": scaleY(sequence.find(x => x.key == d.Stage).position)
                    }
                    var stop = {
                        "x": Math.round(scale(parseTime(peace_process_data[d.PPName][i + 1].Dat))),
                        "y": scaleY(sequence.find(x => x.key == peace_process_data[d.PPName][i + 1].Stage).position)
                    }
                    var distance = (stop.x - start.x) / 1.5
                    return "M " + start.x + " " + start.y + " C " + (start.x + distance) + " " + start.y + ", " + (stop.x - distance) + " " + stop.y + ", " + stop.x + " " + stop.y
                }
            }

            let container = messy_svg.append("g")
                .attr("class", "processes")
                .attr("clip-path", "url(#ellipse-clip)")
                .attr("pointer-events", "all")
                .attr("transform", `translate(5,0)`);

            let process = container.selectAll("g")
                .data(Object.entries(peace_process_data)).enter()
                .append("g")
                .attr("class", d => "PP-" + d[1][0].PP)
                .selectAll("path").data(d => d[1])
                .enter()

            let processPath = process.append("path")
                .attr("class", "messy_path")
                .attr("pointer-events", "none")
                .attr("fill-opacity", 0)
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke-opacity", 1)
                .attr("d", (d, i) => segment(d, i, scaleX))
                .attr("stroke", (d, i) => {
                    if (i < peace_process_data[d.PPName].length - 1) {
                        var tendency = scaleY(sequence.find(x => x.key == peace_process_data[d.PPName][i + 1].Stage).position) - scaleY(sequence.find(x => x.key == d.Stage).position)
                        return scaleColor(tendency)
                    }
                })

            //draw circles for each agreement
            let circles = messy_svg.append("g")
                .attr("transform", `translate(5,0)`)
                .attr("class", "circles")
                .selectAll("circle")
                .data(year_array)
                .enter()
                .append("circle")
                .attr("class", d => "PP-" + d.PP)
                .attr("cx", d => Math.round(scaleX(parseTime(d.Dat))))
                .attr("cy", d => scaleY(sequence.find(x => x.key == d.Stage).position))
                .attr("r", function (d) {
                    if (d.AgtId == description.id) {
                        return 6
                    }
                    else {
                        return 3
                    }
                })
                .style('fill', function (d) {
                    if (d.AgtId == description.id) {
                        return "white"
                    }
                    else {
                        return "gray"
                    }
                })
                .style("cursor", "pointer")
                .on("mouseover", function (d, i) {
                    d3.select("#timeline_description")
                        .style("display", "block")
                        .style("left", d.x - 160 + "px")
                        .style("top", d.y - 20 + "px")
                        .html(i.Agt + ` (` + i.Dat + `)`)
                })
                .on("mouseleave", function (d, i) {
                    d3.select("#timeline_description")
                        .style("display", "none")
                })

            d3.selectAll(".domain")
                .attr("visibility", "hidden")
        })

        let clicked_bar = 0;
        // main timeline draw bars
        main_timeline.selectAll("mybar")
            .data(main_timeline_year_group)
            .join("rect")
            .attr("x", main_x(0))
            .attr("y", function (d) { return main_y(d[0]); })
            .attr("width", function (d) { return main_x(d[1].length); })
            .attr("height", main_y.bandwidth())
            .attr("rx", "1px")
            .attr("fill", "white")
            .attr("class", "mybar")
            .attr("cursor", "pointer")
            .on("mouseover", function (d, i) {
                if (clicked_bar !== 1) {
                    d3.select(this).style("fill", "#006297")
                }
            })
            .on("mouseout", function (d, i) {
                if (clicked_bar !== 1) {
                    d3.select(this).style("fill", "white")
                }
            })
            .on("click", function (d, i) {
                clicked_bar = 1;
                d3.selectAll(".circle").style("border", "none")
                const radios = document.querySelectorAll('input.radio');
                radios.forEach(radio => radio.checked = false);
                d3.selectAll(".mybar").style("fill", "white")
                d3.select(this).style("fill", "#006297")
                map.setFilter('population', ['==', 'year', i[0]]);
            })

        main_timeline.selectAll("mybar_text")
            .data(main_timeline_year_group)
            .join("text")
            .attr("x", function (d) { return main_x(d[1].length) + 10 })
            .attr("y", function (d) { return main_y(d[0]) + 9 })
            .text(d => d[1].length)
            .attr("fill", "white")
            .attr("font-size", "10px")
        // .attr("dy", "4px")

        main_timeline.append("g")
            .selectAll("mybar_text_year")
            .data(main_timeline_year_group)
            .join("text")
            .attr("x", 0)
            .attr("y", function (d) { return main_y(d[0]) + 10; })
            .text(d => d[0])
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .attr("font-size", "11px")
        // .attr("dy", "12px")

        const refresh_filter = function () {
            d3.selectAll(".circle").style("border", "none")
            d3.selectAll(".mybar").style("fill", "white")
            const radios = document.querySelectorAll('input.radio');
            radios.forEach(radio => radio.checked = false);
        }

        // filter by stages
        d3.select(".pre").on("click", function () {
            refresh_filter();
            d3.select(this).style("border", "solid 1px")
            map.setFilter('population', ['==', 'stage', "Pre-negotiation"]);
        })
        d3.select(".cea").on("click", function () {
            refresh_filter();
            d3.select(this).style("border", "solid 1px")
            map.setFilter('population', ['==', 'stage', "Ceasefire"]);
        })
        d3.select(".par").on("click", function () {
            refresh_filter();
            d3.select(this).style("border", "solid 1px")
            map.setFilter('population', ['==', 'stage', "Framework-substantive, partial"]);
        })
        d3.select(".imp").on("click", function () {
            refresh_filter();
            d3.select(this).style("border", "solid 1px")
            map.setFilter('population', ['==', 'stage', "Implementation"]);
        })
        d3.select(".oth").on("click", function () {
            refresh_filter();
            d3.select(this).style("border", "solid 1px")
            map.setFilter('population', ['==', 'stage', "Other"]);
        })

        d3.select("#nat").on("click", function () {
            map.setFilter('population', ['==', 'national', "Y"]);
            d3.selectAll(".mybar").style("fill", "white")
            d3.selectAll(".circle").style("border", "none")
        })
        d3.select("#rit").on("click", function () {
            map.setFilter('population', ['==', 'rit', "1"]);
            d3.selectAll(".mybar").style("fill", "white")
            d3.selectAll(".circle").style("border", "none")
        })
        d3.select("#gri").on("click", function () {
            map.setFilter('population', ['==', 'grieve', "1"]);
            d3.selectAll(".mybar").style("fill", "white")
            d3.selectAll(".circle").style("border", "none")
        })
        d3.select("#cat").on("click", function () {
            map.setFilter('population', ['==', 'cattle', "1"]);
            d3.selectAll(".mybar").style("fill", "white")
            d3.selectAll(".circle").style("border", "none")
        })
        d3.select("#cov").on("click", function () {
            map.setFilter('population', ['==', 'cover', "1"]);
            d3.selectAll(".mybar").style("fill", "white")
            d3.selectAll(".circle").style("border", "none")
        })


        map.on('mousemove', 'population', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const description = e.features[0].properties
            // if (e.features.length > 0) {
            //     if (hoveredPolygonId !== null) {
            //         map.setFeatureState(
            //             { source: 'states', id: hoveredPolygonId },
            //             { click: false }
            //         );
            //     }
            //     hoveredPolygonId = e.features[0].id;
            //     map.setFeatureState(
            //         { source: 'states', id: hoveredPolygonId },
            //         { click: true }
            //     );
            // }

            d3.select("#description")
                .style("display", "block")
                .style("left", e.point.x + 30 + "px")
                .style("top", e.point.y - 25 + "px")
                .html(description.agreement)
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'population', () => {
            map.getCanvas().style.cursor = '';
            // if (hoveredPolygonId !== null) {
            //     map.setFeatureState(
            //         { source: 'states', id: hoveredPolygonId },
            //         { hover: false }
            //     );
            // }
            // hoveredPolygonId = null;
            d3.select("#description")
                .style("display", "none")
        });

        // refresh everything
        d3.selectAll("#refresh_button, #mini_refresh_button, #mini_refresh").on("click", function (m) {
            d3.selectAll(".legend_circle")
                .style("stroke", "none")
            clicked_bar = 0;
            d3.selectAll(".mybar").style("fill", "white")
            d3.selectAll(".circle").style("border", "none")
            const radios = document.querySelectorAll('input.radio');
            radios.forEach(radio => radio.checked = false);
            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    { source: 'states', id: hoveredPolygonId },
                    { click: false }
                );
            }
            hoveredPolygonId = null;
            map.flyTo({ center: [40.137343, 25.137451], zoom: adjust_zoom });
            // d3.select("#big_title").text("Conflict and Peace Process Map")
            d3.selectAll("#peace_process, #info")
                .transition().duration(800)
                .style("right", - screen_width * 0.30 + "px")
            d3.select("#codebook")
                .transition().duration(800)
                .style("right", - screen_width * 0.40 + "px")
            counter_collab = 0;
            code_counter = 0;
            map.setFilter('population', null)
        })
    })
});