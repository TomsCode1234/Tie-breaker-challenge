var mapSelected, mapData;
var Nmonsters, monsterNames, deadMon = 0, monRuns = 0;
var Temp, ran, loc, allow = false;
var north="", south="", east="", west="";
var Monsters = new Array();
var Citys = new Array();

//Function collects all users Input.
$( "#MainInput").submit(function( event ) {
    
    event.preventDefault();
    
    $("#MainInput").css({"height" : "0px", "overflow" : "hidden"});
    $("#dataOuptput").css("height", "800px");
    
    Nmonsters = $("#Nmonsters").val();
    mapSelected = $("#MapSize").find(":selected").text();
    
    GetMap();
});

//Gets data from relevant map.(selected through user input).
function GetMap() {
    if (mapSelected == "Medium"){
            $.ajax({
                url : "https://cdn.rawgit.com/TomsCode1234/a0362d425050adc620ec14aba1aa3e39/raw/b315773fe34ef3b20017ded6b07fc9f71da3d05f/world_map_medium.txt",
                dataType: "text",
                success : function (data) {
                    mapData = data;
                    mapArray();
                }
            });   
        }
    if (mapSelected == "Small"){
        $.ajax({
                url : "https://cdn.rawgit.com/TomsCode1234/0d97cc8504e58c2b53e09e065a45e532/raw/47c4c6e595cdfcc1127736b99251b748600984be/world_map_small.txt",
                dataType: "text",
                success : function (data) {
                    mapData = data;
                    mapArray();
                }
            });  
    }  
}

//Splits up data and adds to array.(assumes data is always entered the same i.e no spaces in names.)
function mapArray(){
    
    var lines = mapData.split("\n");
    $.each(lines, function(n, elem) {
        var cityname = elem.slice(0, elem.indexOf(" "));
        north = "";
        south = "";
        east ="";
        west = "";
        var val = elem.split(' ');
        $.each(val, function(d, dat) {
            Temp = dat;
            GetDir();
        });
        if(cityname != ""){
            Citys.push({
                CityName: cityname,
                North: north,
                South: south,
                East: east,
                West: west,
                Monsters: "",
            });
        }
    });
    GetMonsters();
}

//gets directions for array.
function GetDir(){
    var Dir = Temp.split("=");
    if(Dir[0] == "north"){
            north = Dir[1]
       }
    if(Dir[0] == "south"){
            south = Dir[1]
       }
    if(Dir[0] == "east"){
            east = Dir[1]
       }
    if(Dir[0] == "west"){
            west = Dir[1]
       }
}


//creates N monsters, names them and adds them to an array.
function GetMonsters(){ 
    $.ajax({
        url : "https://cdn.rawgit.com/TomsCode1234/b11648ef6918bdcf1f1311d0fbc82da7/raw/39a2be4f460400cecfd3b3aafe449821ff7baeb4/Names.txt",
        dataType: "text",
        success : function (data) {
            monsterNames = data;
            var lines = monsterNames.split("\n");
            for(i=0; i < Nmonsters; i++){
                var name = lines[i].split(" ");
                var monName = name[0];
                Monsters.push({
                    monName: monName,
                    location: ""
                    }); 
            }
            SpawnMonsters(); 
        }
    }); 
}


//spawns the monsters in ready to wreak havoc
function SpawnMonsters(){
    for(i = 0; i < Monsters.length; i++){
        if(Citys.length != 0){
            loc = Math.floor(Math.random() * Citys.length); 
            if(Citys[loc] != undefined){
                if(Citys[loc].Monsters == ""){
                    Citys[loc].Monsters = Monsters[i].monName;
                    Monsters[i].location = loc;
                }else{
                    //if monsters spawn in the same city...fight and die
                    $("#dataOuptput").append("<p>" + Monsters[i].monName + " spawned in " + Citys[loc].CityName + " with " + Citys[loc].Monsters + ". The city was destroyed </p> <br>");
                    console.log(Monsters[i].monName, " spawned in ", Citys[loc].CityName, " with ", Citys[loc].Monsters,  ". The city was destroyed");
                    $.each(Monsters, function(index, value){
                        if(value != undefined){
                            if(value.monName == Citys[loc].Monsters){
                                delete Monsters[index];
                            }
                        }
                    });
                    delete Monsters[i];
                    delete Citys[loc];
                }
            }else{
                //if the city was already destroyed monster dies in wilderness (incase more monsters are sapwned then citys)
                $("#dataOuptput").append("<p>"+ Monsters[i].monName + " spawned in an already destroyed city...he died of starvation<.p> <br>");
                console.log(Monsters[i].monName, " spawned in an already destroyed city...he died of starvation");
                delete Monsters[i];
            }
        }else{
            console.log("game ended");
        }
    }
    
    monsterRoamig();
}


//Function for the monster roaming all over the joint
function monsterRoamig(){
        $.each(Citys, function(i, val){
            if(val != undefined){
                $.each(Citys, function(index, value){
                    if(value != undefined){    
                        if(value.CityName == val.North){
                            val.North = index;
                        }
                        if(value.CityName == val.South){
                            val.South = index;
                        }
                        if(value.CityName == val.East){
                            val.East = index;
                        }
                        if(value.CityName == val.West){
                            val.West = index;
                        }
                    }
                });
            }
        });
        //move monster
        var newCity = "";
        while(monRuns < 10000){
            monRuns = monRuns+1;
            deadMon = 0;
            $.each(Monsters, function(i, val){
                        //get direction of monster
                if(val != undefined){
                        allow =false;
                        Temp = 0;
                        while(allow == false){
                            Temp = Temp+1;
                            ran = Math.floor(Math.random() * 4) + 1;
                           if(ran == 1){
                               if(Citys[Citys[val.location].North] != undefined){
                                   NewCity = Citys[val.location].North;
                                   allow = true;
                                   //console.log("North ", Citys[Citys[val.location].North]);
                               }else{
                                   ran = 2
                               }
                           }
                           if(ran == 2){
                               if(Citys[Citys[val.location].South] != undefined){
                                   NewCity = Citys[val.location].South;
                                   allow = true;
                                   //console.log("South ", Citys[Citys[val.location].South]);
                               }else{
                                   ran = 3
                               }
                                      
                           }
                           if(ran == 3){
                               if(Citys[Citys[val.location].East] != undefined){
                                   NewCity = Citys[val.location].East;
                                   allow = true;
                                   //console.log("East", Citys[Citys[val.location].East]);
                               }else{
                                   ran = 4
                               }
                                
                           }
                           if(ran == 4){
                               if(Citys[Citys[val.location].West] != undefined){
                                   NewCity = Citys[val.location].West;
                                   allow = true;
                                   //console.log("West ", Citys[Citys[val.location].West]);
                               }else{
                                   ran = 1
                               }
                                   
                           }
                            if(Temp > 1000){
                                allow = true;
                                NewCity = "";
                            } 
                        }
                        //move or fight on collide
                        if(NewCity != ""){
                            if(Citys[NewCity].Monsters != ""){
                                console.log(Monsters[i].monName, " entered ", Citys[NewCity].CityName, " City where ", Citys[NewCity].Monsters, " was. They destroyed the city");
                                 $("#dataOuptput").append("<p>"+ Monsters[i].monName + " entered " + Citys[NewCity].CityName + " City where " + Citys[NewCity].Monsters + " was. They destroyed the city</p><br>");
                                Citys[val.location].Monsters = "";
                                $.each(Monsters, function(index, value){
                                    if(value != undefined){
                                        if(value.monName == Citys[NewCity].Monsters){
                                            delete Monsters[index];
                                        }
                                    }
                                });
                                delete Citys[NewCity];
                                delete Monsters[i];
                            }else{
                                if(Citys[NewCity].Monsters == ""){
                                    Citys[val.location].Monsters = "";
                                    Citys[NewCity].Monsters = val.monName;
                                    val.location = NewCity;
                                    console.log(val.monName, " moved to ", Citys[NewCity].CityName);
                                }
                            }
                        }else{
                            console.log(val.monName, " is trapped in ", Citys[val.location].CityName);
                        }
                }else{
                    deadMon = deadMon+1;
                }
                });
            if(deadMon == Monsters.length){
                monRuns = 10000;
            }
        }
    GetRemainingCitys();
}


//function to get and display all the remaining citys
function GetRemainingCitys(){
    $("#dataOuptput").append("<h3>Citys still standing:");
    $.each(Citys, function(i, val){
        if(val != undefined){
            console.log(val.CityName, " City is still standing");
             $("#dataOuptput").append("<p>" + val.CityName + "</p>");
        }
    });
}