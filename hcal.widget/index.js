command: "curl -s 'https://clearoutside.com/forecast/{LAT}/{LONG}?view=midnight' 'https://www.timeanddate.com/moon/{country}/{city}'",

dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
offdayIndices: [0, 6], // Saturday & Sunday
 
refreshFrequency: 5000,
displayedDate: null,

render: function () {
  return "<style>@-webkit-keyframes pulse{0%{opacity:0}100%{opacity:1}}</style>\
      <div class=\"cal-container\">\
  <div class=\"title\"></div>\
  <table>\
  <tr class=\"weekday\"></tr>\
  <tr class=\"midline\"></tr>\
  <tr class=\"date\"></tr>\
  <tr class=\"status_top\"></tr>\
  <tr class=\"status_bottom\"></tr>\
  </table>\
  </div>";
},
 
style: "                              \n\
  bottom: 10px                        \n\
  right: 30px                         \n\
  left: 29.5% \n\
  font-family: -apple-system          \n\
  font-size: 13px                     \n\
  font-weight: 500                    \n\
  color: #fff                         \n\
                                      \n\
  .cal-container                      \n\
    border-radius: 10px               \n\
    background: rgba(#000, 0)         \n\
    padding: 0px                      \n\
                                      \n\
  .title                              \n\
    color: rgba(#fff, .3)             \n\
    font-size: 20px                   \n\
    font-weight: 500                  \n\
    padding-bottom: 14px              \n\
    text-transform uppercase          \n\
    text-align: right				  \n\
                                      \n\
  table                               \n\
    border-collapse: collapse         \n\
    table-layout: fixed 			  \n\
    width: 100% 					  \n\
                                      \n\
  td                                  \n\
    text-align: center                \n\
                                      \n\
  .weekday td                         \n\
    padding-top: 6px                  \n\
    padding-bottom: 6px				  \n\
                                      \n\
  .date td                            \n\
    padding-top: 6px                  \n\
    padding-bottom: 6px               \n\
                                      \n\
  .today, .off-today                  \n\
    background: rgba(#fff, 0.2)       \n\
                                      \n\
  .weekday .today,                    \n\
  .weekday .off-today                 \n\
    border-radius: 3px 3px 0 0        \n\
    padding-bottom: 6px 			  \n\
                                      \n\
  .date .today,                       \n\
  .date .off-today                    \n\
    border-radius: 0 0 3px 3px        \n\
    padding-top: 6px 				  \n\
                                      \n\
  .midline                            \n\
    height: 3px                       \n\
    background: rgba(#fff, .5)        \n\
                                      \n\
  .midline .today                     \n\
    background: rgba(#0bf, .8)        \n\
                                      \n\
  .midline .offday                    \n\
    background: rgba(#f77, .5)        \n\
                                      \n\
  .midline .off-today                 \n\
    background: rgba(#fc3, .8)        \n\
                                      \n\
  .offday, .off-today                 \n\
    color: rgba(#f77, 1)              \n\
                                      \n\
  .status_top                         \n\
    height: 3px                       \n\
    background: rgba(0, 0, 0, 0)      \n\
                                      \n\
  .status_top .open                   \n\
    background: rgba(#5EEA8E, .8)     \n\
    animation:                        \n\
    pulse 2s alternate infinite       \n\
    border-radius: 5px                \n\
                                      \n\
  .status_bottom                      \n\
    height: 3px                       \n\
    background: rgba(0, 0, 0, 0)      \n\
    animation:                        \n\
    pulse 2s alternate infinite       \n\
    border-radius: 5px                \n\
                                      \n\
  .First                              \n\
   background: linear-gradient(90deg, black, black 50%, white)  \n\
   border-radius: 5px                 \n\
                                      \n\
  .Full                               \n\
   background: linear-gradient(90deg, white, white)             \n\
   border-radius: 5px                 \n\
                                      \n\
  .Third                              \n\
   background: linear-gradient(-90deg, black, black 50%, white) \n\
   border-radius: 5px                 \n\
                                      \n\
  .New                                \n\
   background: linear-gradient(90deg, gray, gray)               \n\
   border-radius: 5px                 \n\
   opacity: .8                        \n\
",

update: function (output, domEl) {
  // var date = output.split("\n"), firstWeekDay = date[0], lastDate = date[1], today = date[2], m = date[3]-1, y = date[4];
  
  // // DON'T MANUPULATE DOM IF NOT NEEDED
  // if(this.displayedDate != null && this.displayedDate == output) return;
  // else this.displayedDate = output;

  var date = new Date(), y = date.getFullYear(), m = date.getMonth(), today = date.getDate();
  
  // DON'T MANUPULATE DOM IF NOT NEEDED
  var newDate = [today, m, y].join("/");
  if(this.displayedDate != null && this.displayedDate == newDate) return;
  else this.displayedDate = newDate;

  var firstWeekDay = new Date(y, m, 1).getDay();
  var lastDate = new Date(y, m + 1, 0).getDate();
    
  var htmlOut = $.parseHTML(output);
  
  var weekdays = "", midlines = "", dates = "", status_top = "", status_bottom = "";

  for (var i = 1, w = firstWeekDay, d = 0; i <= lastDate; i++, w++) {
    w %= 7;
    var isToday = (i == today), isOffday = (this.offdayIndices.indexOf(w) != -1);
    var className = "ordinary";
    if(isToday && isOffday) className = "off-today";
    else if(isToday) className = "today";
    else if(isOffday) className = "offday";
      
    var moon = ""; //Time&Date Moon Phases
    var moon_table = $(htmlOut).find("#tb-7dmn").get(0);
    var day_array = $(moon_table).find("tbody > tr").get(i - 1);
    var moon_status = $(day_array).find("img").attr("title");
      if (moon_status != null) moon = moon_status.substr(0, moon_status.indexOf(" "));
      
    var fS = ""; //Clear Outside Forecast
    if (i >= today && i < today + 7) {
        var query = $(htmlOut).find(".fc_hour_ratings").get(d);
        var table = $(query).find("ul").get(0);
            $(table).find("li").each(function(a) {
            if ($(this).hasClass("fc_good")) fS = "open";
        });
        d++
    }

    weekdays += "<td class=\""+className+"\">" + this.dayNames[w] +"</td>";
    midlines += "<td class=\""+className+"\"></td>";
    dates += "<td class=\""+className+"\">" + i + "</td>";
    status_top += "<td class=\""+fS+"\"></td>";
    status_bottom += "<td class=\""+moon+"\"></td>";
  };

  $(domEl).find(".title").html(this.monthNames[m]+" <span style='color:lightgray'>"+y+"</span>");
  $(domEl).find(".weekday").html(weekdays);
  $(domEl).find(".midline").html(midlines);
  $(domEl).find(".date").html(dates);
  $(domEl).find(".status_top").html(status_top);
  $(domEl).find(".status_bottom").html(status_bottom);
}