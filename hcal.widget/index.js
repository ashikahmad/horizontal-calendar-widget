/* Please check the correct values for your location to ensure you get the most reliable information.

   Go to these pages and confirm values from url
    - https://clearoutside.com
    - https://www.timeanddate.com/moon
*/

_: (() => this.options = {
    enable: true,
    lat: '21.54,
    long: '73.66',
    country: 'usa',
    city: 'miami'
  })(),

  dayNames: ["Sunday", "Monday", "Tueesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  offdayIndices: [0, 6], // Saturday & Sunday

  refreshFrequency: 1000 * 60 * 60,
  displayedDate: null,

  render: function (output) {
    return '<style>@-webkit-keyframes pulse{0%{opacity:0}100%{opacity:1}}</style>' +
      '<div class="cal-container">' +
      '<div class=\"title\"></div>' +
      '<table>' +
      '<tr class=\"weekday\"></tr>' +
      '<tr class=\"midline\"></tr>' +
      '<tr class=\"date\"></tr>' +
      '<tr class=\"status_top\"></tr>' +
      '<tr class=\"status_bottom\"></tr>' +
      '</table>' +
      '</div>';
  },

  style: `                              
  bottom: 10px                        
  right: 30px                         
  left: 29.5% 
  font-family: -apple-system          
  font-size: 13px                     
  font-weight: 500                    
  color: #fff      
  user-select: none                   
                                      
  .cal-container                      
    border-radius: 10px               
    background: rgba(#000, 0)         
    padding: 0px                      
                                      
  .title                              
    color: rgba(#fff, .3)             
    font-size: 20px                   
    font-weight: 500                  
    padding-bottom: 14px              
    text-transform uppercase          
    text-align: right				  
                                      
  table                               
    border-collapse: collapse         
    table-layout: fixed 			  
    width: 100% 					  
                                      
  td                                  
    text-align: center                
                                      
  .weekday td                         
    padding-top: 6px                  
    padding-bottom: 6px				  
                                      
  .date td                            
    padding-top: 6px                  
    padding-bottom: 6px               
                                      
  .today, .off-today                  
    background: rgba(#fff, 0.2)       
                                      
  .weekday .today,                    
  .weekday .off-today                 
    border-radius: 3px 3px 0 0        
    padding-bottom: 6px 			  
                                      
  .date .today,                       
  .date .off-today                    
    border-radius: 0 0 3px 3px        
    padding-top: 6px 				  
                                      
  .midline                            
    height: 3px                       
    background: rgba(#fff, .5)        
                                      
  .midline .today                     
    background: rgba(#0bf, .8)        
                                      
  .midline .offday                    
    background: rgba(#f77, .5)        
                                      
  .midline .off-today                 
    background: rgba(#fc3, .8)        
                                      
  .offday, .off-today                 
    color: rgba(#f77, 1)              
                                      
  .status_top                         
    height: 3px                       
    background: rgba(0, 0, 0, 0)      
                                      
  .status_top .open                   
    background: rgba(#5EEA8E, .8)     
    border-radius: 5px                
                                      
  .status_bottom                      
    height: 3px                       
    background: rgba(0, 0, 0, 0)      
    border-radius: 5px
    
  .pulse-anim    
    animation:                        
    pulse 2s alternate infinite
                                      
  .First                              
   background: linear-gradient(90deg, transparent, transparent 50%, white)  
   border-radius: 5px                 
                                      
  .Full                               
   background: linear-gradient(90deg, white, white)             
   border-radius: 5px                 
                                      
  .Third                              
   background: linear-gradient(-90deg, transparent, transparent 50%, white) 
   border-radius: 5px                 
                                      
  .New                                
   background: linear-gradient(90deg, gray, gray)               
   border-radius: 5px                 
   opacity: .8        
`,

  afterRender: function (domEl) {
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth(),
      today = date.getDate();

    var newDate = [today, m, y].join("/");
    if (this.displayedDate != null && this.displayedDate == newDate) return;
    else this.displayedDate = newDate;

    var firstWeekDay = new Date(y, m, 1).getDay();
    var lastDate = new Date(y, m + 1, 0).getDate();

    var weekdays = "",
      midlines = "",
      dates = "";

    for (var i = 1, w = firstWeekDay, d = 0; i <= lastDate; i++, w++) {
      w %= 7;
      var isToday = (i == today),
        isOffday = (this.offdayIndices.indexOf(w) != -1);
      var className = "ordinary";
      if (isToday && isOffday) className = "off-today";
      else if (isToday) className = "today";
      else if (isOffday) className = "offday";

      weekdays += "<td class=\"" + className + "\">" + this.dayNames[w].substring(0, 3) + "</td>";
      midlines += "<td class=\"" + className + "\"></td>";
      dates += "<td class=\"" + className + "\">" + i + "</td>";
    };

    $(domEl).find(".title").html(this.monthNames[m] + " <span style='color:lightgray'>" + y + "</span>");
    $(domEl).find(".weekday").html(weekdays);
    $(domEl).find(".midline").html(midlines);
    $(domEl).find(".date").html(dates);
  },

  update: function (dull, domEl) {
    var command = `curl -s 'https://clearoutside.com/forecast/${this._["lat"]}/${this._["long"]}?view=midnight' 'https://www.timeanddate.com/moon/${this._["country"]}/${this._["city"]}'`

    if (this._["enable"]) {
      this.run(command, (err, output) => {
        var date = new Date(),
          y = date.getFullYear(),
          m = date.getMonth(),
          today = date.getDate();

        var lastDate = new Date(y, m + 1, 0).getDate();

        var htmlOut = $.parseHTML(output);

        var status_top = "",
          status_bottom = "";

        for (var i = 1, d = 0; i <= lastDate; i++) {
          var moon = ""; //Time&Date Moon Phases
          var moon_table = $(htmlOut).find("#tb-7dmn").get(0);
          var day_array = $(moon_table).find("tbody > tr").get(i - 1);
          var moon_status = $(day_array).find("img").attr("title");
          if (moon_status != null) moon = moon_status.substr(0, moon_status.indexOf(" "));

          var fS = ""; //Clear Outside Forecast
          if (i >= today && i < today + 7) {
            var query = $(htmlOut).find(".fc_hour_ratings").get(d);
            var table = $(query).find("ul").get(0);
            $(table).find("li").each(function (a) {
              if ($(this).hasClass("fc_good")) fS = "open";
            });
            d++
          }
          status_top += "<td class=\"" + fS + "\"></td>";
          status_bottom += "<td class=\"" + moon + "\"></td>";
        };

        $(domEl).find(".status_top").html(status_top);
        $(domEl).find(".status_bottom").html(status_bottom);

        $(domEl).find(".status_top").add($(domEl).find(".status_bottom")).addClass("pulse-anim");
      });
    }
  }