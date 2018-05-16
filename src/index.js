$(document).ready(function () {

    var date = new Date();
    var year;
    var jsMonth;
    var month;
    var daysInMonth;
    //var i;
    var selectedDay;

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

    $("#previous-month").click(function () {
        if (jsMonth === 0) {
            setDateFields(--year, 11);
        } else {
            setDateFields(year, --jsMonth);
        }
        generateContent();
        $(this).blur();
    });

    //$("form").submit(function () { //et kiprobalni url parameterekkel
    $("#confirm-required").click(function () {
        console.log(selectedDay);
        var time = $("input[name=requiredTime]").val();
        var unit = $("select[name=unit]").val();
        var dateParts = selectedDay.split("-");
        if (unit === "hr") {
            time = time * 60;
        }

        var workDayRB = {
            "year": dateParts[0],
            "month": dateParts[1],
            "day": dateParts[2],
            "requiredMinPerDay": time
        };
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:9090/tlog-backend/timelogger/workmonths/workdays", true);
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:9090/tlog-backend/timelogger/workmonths/workdays");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.send(JSON.stringify(workDayRB));

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log("4 200");
                printCalendarBody();
            } else if (this.readyState === 4 && this.status === 418) {
                console.log("4 418");
                if (confirm("Are you sure you want to activate a weekend day?")) {

                    var xhttp2 = new XMLHttpRequest();
                    xhttp2.open("POST", "http://localhost:9090/tlog-backend/timelogger/workmonths/weekends", true);
                    xhttp2.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:9090/tlog-backend/timelogger/workmonths/weekends");
                    xhttp2.setRequestHeader("Content-Type", "application/json");

                    xhttp2.send(JSON.stringify(workDayRB));

                    xhttp2.onreadystatechange = function () {
                        if (this.readyState === 4 && this.status === 200) {
                            console.log("4 200");
                            printCalendarBody();
                        }
                    };
                }

            }
        };


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
        console.log("print calendar body");
        var dayOfWeek = 0;
        var indent = getIndent(year, month);
        var day = 1;
        var url = "http://localhost:9090/tlog-backend/timelogger/workmonths/" + year + "/" + month;
        var workDays;
        var i;
        $("#calendar-body").empty();
        $("#calendar-body").append("<tr></tr>");
        for (i = 0; i < indent; i++) {
            $("#calendar-body tr").append("<td class=\"other-month\"></td>");
            dayOfWeek++;
        }

        var id;
        var td;
        for (i = 1; i <= daysInMonth; i++) {
            if (dayOfWeek % 7 === 0) {
                $("#calendar-body").append("<tr></tr>");
                dayOfWeek = 0;
            }

            id = "id=" + year + "-" + month + "-" + day++;
            td = "<td " + id + "><a data-toggle=\"modal\" data-target=\"#required_hr\">" + i + "<div class=\"inactive\">+</div></a></td>";
            $("#calendar-body tr:last").append(td);
            dayOfWeek++;
        }

        while (dayOfWeek < 7) {
            $("#calendar-body tr:last").append("<td class=\"other-month\"></td>");
            dayOfWeek++;
        }

        var requiredMin = 0;
        var sumPerDays = 0;
        var extraMin = 0;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                workDays = JSON.parse(this.responseText);
                for (i = 0; i < workDays.length; i++) {
                    id = "#" + workDays[i].actualDay.replace(/-0+/g, '-');
                    $(id + " a").removeAttr("data-toggle data-target");
                    $(id + " a").attr("href", "#");
                    if (workDays[i].extraMinPerDay >= 0) {
                        $(id + " div").attr("class", "min positive");
                    } else {
                        $(id + " div").attr("class", "min negative");
                    }
                    $(id + " div").empty().append(workDays[i].extraMinPerDay);
                    requiredMin += workDays[i].requiredMinPerDay;
                    sumPerDays += workDays[i].sumPerDay;
                    extraMin += workDays[i].extraMinPerDay;
                }
                $("#test").append("<br>GET id: " + id);
                $("#required_min").text(requiredMin);
                $("#sum_of_month").text(sumPerDays);
                $("#extra_min").text(extraMin);
                if (extraMin >= 0) {
                    $("#extra_min").attr("class", "positive");
                } else {
                    $("#extra_min").attr("class", "negative");
                }

            }
        };

        xhttp.send();
        $("td").click(function () {
            selectedDay = $(this).attr("id");
            $("#test").text(selectedDay);
        });
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


