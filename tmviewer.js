  d3.csv("metadata.csv", function(error, metadata) {
    
  d3.json("topics.json",function(error, topics) {
    exposedTopics = topics;
   
  d3.csv("topictime.csv",function(error, time) {
    
    exposedTime = time;
  d3.csv("doclinks.csv",function(error, docs) {
    exposedDocs = docs;
        newTopics = [];
    
    for (x in exposedTopics.topics) {
      newTopicObj = {};
      newTopicObj.label = exposedTopics.topics[x].label;
      newTopicObj.totaltokens = exposedTopics.topics[x].totaltokens;
      newTopicObj.uniquetokens = exposedTopics.topics[x].uniquetokens;
      newTopicObj.tNumber = exposedTopics.topics[x].label.split(" ")[1]
      newTopicObj.words = [];
      newTopicObj.time = [];
      newTopicObj.docs = [];
      for (y in exposedTopics.topics[x].words) {
        newWordObj = {};
        for (z in exposedTopics.topics[x].words[y]) {
         newWordObj.text = z;
         newWordObj.percent = exposedTopics.topics[x].words[y][z];
        newTopicObj.words.push(newWordObj);
        }
      }
      
      for (x in exposedTime) {
        if (exposedTime[x].label == newTopicObj.label) {
          newTimeObj = {};
          newTimeObj.year = parseInt(exposedTime[x].year);
          newTimeObj.density = exposedTime[x].density;
          newTopicObj.time.push(newTimeObj);
        }
      }
      
        for (x in exposedDocs) {
        if (exposedDocs[x].label == newTopicObj.label) {
          newDocObj = {};
          newDocObj.strength = parseFloat(exposedDocs[x].strength);
          newDocObj.doc = exposedDocs[x].document;
          newTopicObj.docs.push(newDocObj);
        }
      }
      
      newTopics.push(newTopicObj);
    }
    
    exposedMedadata = metadata;
    
    mdHash = {};
    
    for (x in exposedMedadata) {
      mdHash[exposedMedadata[x].id] = exposedMedadata[x]
    }
    
    topicGram();
         
         });
         });
         });
    });

  
  function topicGram() {
    
    d3.select("#vizcontainer").append("svg").on("click", svgClick).attr("id", "mainSVG").style("width", "100%").style("height", "100%")


wordScale=d3.scale.linear().domain([0.01,0.1,0.5,1]).range([10,40,80,160]).clamp(true);
wordColor=d3.scale.linear().domain([10,40,80,160]).range(["blue","green","orange","red"]);
timeScale=d3.scale.linear().domain([1993,2013]).range([0,190]);
densityScale=d3.scale.linear().domain([0,10]).range([0,20]).clamp(true);

newTopics.sort(function (a,b) {
    if (parseInt(a.tNumber) > parseInt(b.tNumber))
    return 1;
    if (parseInt(a.tNumber) < parseInt(b.tNumber))
    return -1;
    return 0;
    });
 
 for (x in newTopics) {
 var curX = (x%10) * 220;
 var curY = (Math.floor(x/10)) * 220;
 d3.layout.cloud().size([200, 200])
      .words(newTopics[x].words)
      .rotate(function() { return ~~(Math.random() * 2) * 5; })
      .fontSize(function(d) { return wordScale(d.percent); })
      .on("end", draw)
      .start();
 
  function draw(words) {

  var sparkLine = d3.svg.line()
        .x(function(d) {
        return timeScale(d.year) + 5
    })
        .y(function(d) {
        return -densityScale(parseFloat(d.density))
    })
        .interpolate("cardinal")
      var thisG = d3.select("#mainSVG").append("g")
        .attr("transform", "translate("+(100+curX)+","+(100+curY)+")")
        .attr("id", "topicG" + newTopics[x].label);
        
      thisG.selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("fill", function(d) { return wordColor(d.size); })
        .style("opacity", .75)
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
        

	thisG
        .append("text")
        .data([newTopics[x]])
        .style("font-size", 20)
        .style("font-weight", 900)
        .attr("x", -25)
        .attr("y", 100)
        .text(function(d) { return d.label; })
        .style("cursor", "pointer")
        .on("click", topicClick);

	var timeG = thisG
        .insert("g", "text")
        .attr("transform", "translate(-100,120)");
        

        timeG.selectAll("rect.background")
        .data(newTopics[x].time)
        .enter()
        .append("rect")
        .attr("class", function(d){return "background timeRect year" + d.year})
        .attr("width", 8)
        .attr("height", 20)
        .attr("x", function(d){return timeScale(d.year) })
        .attr("y", -20)
        .style("fill", "black")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", 0)
        .on("mouseover", labelRect);
        
        timeG.selectAll("rect.foreground")
        .data(newTopics[x].time)
        .enter()
        .append("rect")
        .attr("class", function(d){return "foreground timeRect year" + d.year})
        .attr("width", "8px")
        .attr("height", function(d){return densityScale(d.density) })
        .attr("x", function(d){return timeScale(d.year) })
        .attr("y", function(d){return -(densityScale(d.density)) })
        .style("fill", "black")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", .25)
        .on("mouseover", labelRect);
        
        newTopics[x].time.sort(function (a, b) {
    if (a.year > b.year)
      return 1;
    if (a.year < b.year)
      return -1;
    return 0;
});

        timeG.append("path")
        .attr("d", sparkLine(newTopics[x].time))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", "3px")

        timeG.selectAll("circle")
        .data(newTopics[x].time)
        .enter()
        .append("circle")
        .attr("class", function(d){return "timeCircle year" + d.year})
        .attr("r", 4)
        .attr("cx", function(d){return timeScale(d.year) + 4 })
        .attr("cy", function(d){return -(densityScale(d.density)) })
        .style("fill", "red")
        .style("stroke", "none")
        .style("stroke-width", "1px")
        .style("opacity", 0)
        .on("mouseover", labelRect);
 
  }
 }

  }

function labelRect(d,i) {
  d3.selectAll(".rectLabel").remove();
  d3.selectAll(".timeRect").style("stroke-width", "1px")
  d3.selectAll(".timeCircle").style("opacity", 0)

  d3.selectAll("circle.year" + d.year).style("opacity", 1)

  d3.select(this.parentNode)
  .append("text")
  .style("stroke-width", 4)
  .style("stroke", "white")
  .style("opacity", .75)
  .attr("class","rectLabel")
  .attr("y", 20)
  .attr("x", timeScale(d.year))
  .text(d.year + ": " + d.density);
  
  d3.select(this.parentNode)
  .append("text")
  .attr("class","rectLabel")
  .attr("y",20)
  .attr("x", timeScale(d.year))
  .text(d.year + ": " + d.density);

}
  
function topicClick(d,i) {
    svgClick();

    d3.event.stopPropagation();

    d.docs.sort(function(a,b) {
    if (parseInt((parseInt(a.doc.substr(2,2)) > 20 ? "19" : "20") + a.doc.substr(2,2)) > parseInt((parseInt(b.doc.substr(2,2)) > 20 ? "19" : "20") + b.doc.substr(2,2)))
    return 1;
    if (parseInt((parseInt(a.doc.substr(2,2)) > 20 ? "19" : "20") + a.doc.substr(2,2)) < parseInt((parseInt(b.doc.substr(2,2)) > 20 ? "19" : "20") + b.doc.substr(2,2)))
    return -1;
    return 0;
    });
    
  var newContent = "";
  newContent += "<h3>" + d.label + "</h3>"
  newContent += "<h4>Total Tokens: " + d.totaltokens + "</h4>"
  newContent += "<h4>Unique Tokens: " + d.uniquetokens + "</h4>"
  newContent += "<h4>Per Unique: " + (Math.floor((d.totaltokens / d.uniquetokens) * 100) / 100) + "</h4>"
  newContent += "<p style='border-top:1px gray solid;'>>5% relation to documents:</p>"
  for (x in d.docs) {
    if ( mdHash[d.docs[x].doc]) {
    newContent += "<p style=\"cursor:pointer;\" onclick=\"documentDetails('"+d.docs[x].doc+"','"+mdHash[d.docs[x].doc].title+"')\">" + (parseInt(d.docs[x].doc.substr(2,2)) > 20 ? "19" : "20") + d.docs[x].doc.substr(2,2) + "<br><span style='font-weight:900;color:darkred;'>" + Math.floor(d.docs[x].strength * 100) + "%<br></span> " + mdHash[d.docs[x].doc].title + "<ul>";
    newContent += "<li>" + mdHash[d.docs[x].doc].author + "</li>";
    newContent += "<li>" + mdHash[d.docs[x].doc].type + "</li></ul></p>";
    }
    else {
      newContent += "<p style=\"cursor:pointer;\" onclick=\"documentDetails('"+d.docs[x].doc+"','"+d.docs[x].doc+"')\">" + (parseInt(d.docs[x].doc.substr(2,2)) > 20 ? "19" : "20") + d.docs[x].doc.substr(2,2) + "<br><span style='font-weight:900;color:darkred;'>" + Math.floor(d.docs[x].strength * 100) + "%<br></span> " + d.docs[x].doc + "</p>"
    }
}
  
  d3.select("#topicDetails").style("display", "block").html(newContent)
  
}

function svgClick() {
  d3.selectAll(".modal").style("display", "none")
}

function showMore() {
  console.log(this);
}

function documentDetails(docID,docTitle) {
  svgClick();
var docContent = "<p><h3>"+docTitle+"</h3><ul>" 
  for (x in exposedDocs) {
    if (exposedDocs[x].document == docID) {
      docContent += "<li>" + exposedDocs[x].label + ": " + Math.floor(exposedDocs[x].strength * 100) + "%";
    }
  }
  docContent += "</ul></p>";
  
  d3.select("#docDetails").style("display", "block").html(docContent);
}