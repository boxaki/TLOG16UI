$(document).ready(function () {
    var date = new Date();
    var year;
    var jsMonth;
    var month;
    var daysInMonth;
    var i;

    setDateFields(date.getFullYear(), date.getMonth());
    generateContent();

    $("#next-year").click(function () {
        setDateFields(++year, jsMonth);
        generateContent();
        $(this).blur();
    });

    $("#next-month").click(function () {
        if (jsMonth === 11) {
            setDateFields(++year, 0);
        } else {
            setDateFields(year, ++jsMonth);
        }
        generateContent();
        $(this).blur();
    });

    $("#previous-year").click(function () {
        setDateFields(--year, jsMonth);
        generateContent();
        $(this).blur();
    });
    
    $("#previous-month").click(function(){
        if(jsMonth === 0){
            setDateFields(--year, 11);
        } else {
            setDateFields(year, --jsMonth);
        }
        generateContent();
        $(this).blur();
    });
    
    function setDateFields(newYear, newJsMonth) {
        year = newYear;
        jsMonth = newJsMonth;
        month = jsMonth + 1;
        daysInMonth = getDaysInMonth(year, month);
        indent = getIndent(year, month);
    }

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    
    function generateContent() {
        updateNavbar();
        printCalendarBody();
    }

    function updateNavbar() {
        $("#year").text(year);
        $("#month").text(month < 10 ? "0" + month : month);
    }

    function printCalendarBody() {
        var dayOfWeek = 0;
        var indent = getIndent(year, month);

        $("#calendar-body").empty();
        $("#calendar-body").append("<tr></tr>");

        for (i = 0; i < indent; i++) {
            $("#calendar-body tr").append("<td class=\"other-month\"></td>");
            dayOfWeek++;
        }

        for (i = 1; i <= daysInMonth; i++) {
            if (dayOfWeek % 7 === 0) {
                $("#calendar-body").append("<tr></tr>");
                dayOfWeek = 0;
            }
            var td = "<td><a data-toggle=\"modal\" data-target=\"#required_hr\">".concat(i, "<div class=\"inactive\">+</div></a></td>");
            $("#calendar-body tr:last").append(td);
            dayOfWeek++;
        }

        while (dayOfWeek < 7) {
            $("#calendar-body tr:last").append("<td class=\"other-month\"></td>");
            dayOfWeek++;
        }
    }

    function getIndent(year, month) {
        var date = new Date(year, month - 1, 1);
        var indent = date.getDay();
        if (indent === 0) {
            indent = 6;
        } else
            indent--;
        return indent;
    }

});


