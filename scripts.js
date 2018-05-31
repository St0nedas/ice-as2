var TEAM_VIEW_STATS 		= 0;
var TEAM_VIEW_LASTROUND 	= 1;
var TEAM_VIEW_LAST5 		= 2;
var TEAM_VIEW_ALL 			= 3;
var TEAM_VIEW_PLAYERS		= 4;

var teamView = -1;

var currentYear = ( new Date() ).getFullYear();

window.onload = function() 
{
	loadTeamsList();
	loadLeagueTable();
	
	$('#team-content-wrapper').css({"display":"none"});
};

function loadTeamsList()
{
	//document.getElementById("nav-team-dropdown").innerHTML = "";
	
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: "http://api.football-data.org/v1/competitions/450/teams",
		dataType: 'json',
		type: 'GET',
	}).done( function( teamList ) 
	{
		for( var i = 0 ; i < teamList.teams.length ; i ++ ) 
		{
			var team = teamList.teams[ i ];
			
			var newTeam = "<option value=" + team._links.self.href +">" + team.name + "</option>";
			$( "#team-select" ).append( newTeam );
		}
	});
}

function loadLeagueTable()
{
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: "http://api.football-data.org/v1/competitions/450/leagueTable",
		dataType: 'json',
		type: 'GET',
	}).done( function( leagueData ) 
	{
		for( var i = 0 ; i < leagueData.standing.length ; i ++ ) 
		{
			var teamData = leagueData.standing[ i ];
			
			var row = "<tr><td>" + teamData.position + "</td><td>" + teamData.teamName + "</td><td>" + teamData.playedGames + "</td><td>" + teamData.points + "</td><td>" + teamData.wins + "</td><td>" + teamData.draws + "</td><td>" + teamData.losses + "</td><td>" + teamData.goals + "</td><td>" + teamData.goalsAgainst + "</td><td>" + teamData.goalDifference + "</td></tr>";
			$( "#league-table" ).append( row );
		}
		
		var title = document.getElementById( "content-navbar-id" );
		title.innerHTML = "<h2>" + leagueData.leagueCaption + " - League Table" + "</h2>";
	});
}

function showLeagueTable()
{
	$('#league-table-content').css({"display":"block"});
	$('#team-content-wrapper').css({"display":"none"});
}

function loadPlayerList()
{
	teamView = TEAM_VIEW_PLAYERS;
	
	document.getElementById( "team-content" ).innerHTML = "";
	var url = document.getElementById( "team-select" ).value + "/players";
	
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: url,
		dataType: 'json',
		type: 'GET',
	}).done( function( playerData )
	{
		var sum = 0;
		var count = 0;
		
		for( var i = 0 ; i < playerData.count ; i += 7 ) 
		{
			var newPlayer = "<tr>";
			
			for( var j = 0 ; j < 7 ; j ++ )
			{
				if( i + j >= playerData.count )
					break;
				
				var player = playerData.players[ i + j ];
				
				sum += getYearsOld( player.dateOfBirth );
				count ++;
				
				
				newPlayer += "<td>" + 
				                "<div class = \"player-container\" align=\"center\">" +
				                    "<img class = \"player-img\" class = \"player-img\"  src = \"player.jpg\" alt=\"Avatar\">" +
							    "<div class = \"player-info\"><h6>" + "#" + player.jerseyNumber + "<br>" + player.name + "<br><br>DOB: " + player.dateOfBirth + "<br><br>Nationality: " + player.nationality + "</h6></div></div>" +
							 "</td>"
			}
			
			newPlayer += "</tr>";
			$( "#team-content" ).append( newPlayer );
		}
		
		$( "#team-content" ).append( "<div class = \"content-wrapper\"><h2>Average Team Age: " + ( Math.round( sum / count ) ) + "</h2></div>" );
	});
}

function getYearsOld( x )
{
	return currentYear - parseInt( x.substring( 0, 4 ) );
}

function loadCompareList()
{
	//document.getElementById("nav-team-dropdown").innerHTML = "";
	var currentTeam = document.getElementById( "team-select" ).value;
	
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: "http://api.football-data.org/v1/competitions/450/teams",
		dataType: 'json',
		type: 'GET',
	}).done( function( teamList ) 
	{
		for( var i = 0 ; i < teamList.teams.length ; i ++ ) 
		{
			var team = teamList.teams[ i ];
			
			if( currentTeam != team._links.self.href )
			{
				var newTeam = "<option value=" + team._links.self.href +">" + team.name + "</option>";
				$( "#opponent-select" ).append( newTeam );
			}
		}
	});
}

function showCurrentStats()
{
	teamView = TEAM_VIEW_STATS;
	
	document.getElementById( "team-content" ).innerHTML = "";
	var url = document.getElementById( "team-select" ).value;
	
	$( "#team-content" ).append( "<div id = \"single-team\" class = \"team-stats-container\">" );
	$( "#single-team" ).append( "<div class = \"team-logo\"  style = \"float: left\">" );
	
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: url,
		dataType: 'json',
		type: 'GET',
	}).done( function( data ) 
	{
		$( "#single-team" ).append( "<img src = \"" + data.crestUrl + "\">" );
		$( "#single-team" ).append( "</div>" );
		
		$( "#single-team" ).append( "<div id = \"single-team-stats\" class = \"team-stats\">" );
		
		showStats( document.getElementById( "team-select" ).value, "#single-team-stats" );
		
		$( "#single-team" ).append( "</div>" );
		$( "#team-content" ).append( "</div>" );
	});
}

function showOpponentStats()
{
	document.getElementById( "team-content" ).innerHTML = "";
	showCurrentStats();
	
	var url = document.getElementById( "opponent-select" ).value;
	
	$( "#team-content" ).append( "<div id = \"other-team\" class = \"team-stats-container\">" );
	$( "#other-team" ).append( "<div class = \"team-logo\" style = \"float: right\">" );
	
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: url,
		dataType: 'json',
		type: 'GET',
	}).done( function( data ) 
	{
		$( "#other-team" ).append( "<img src = \"" + data.crestUrl + "\">" );
		$( "#other-team" ).append( "</div>" );
		
		$( "#other-team" ).append( "<div id = \"other-team-stats\" class = \"team-stats\">" );
		
		showStats( document.getElementById( "opponent-select" ).value, "#other-team-stats" );
		
		$( "#other-team" ).append( "</div>" );
		//$( "#team-content" ).append( "</div>" );
	});
}

function showStats( url, div )
{
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: "http://api.football-data.org/v1/competitions/450/leagueTable",
		dataType: 'json',
		type: 'GET',
	}).done( function( leagueData ) 
	{
		for( var i = 0 ; i < leagueData.standing.length ; i ++ ) 
		{
			var teamData = leagueData.standing[ i ];
			
			if( teamData._links.team.href == url  )
			{
				$( div ).append( "<br>Games Player: " + teamData.playedGames );
				$( div ).append( "<br>Points: " + teamData.points );
				$( div ).append( "<br>Goals: " + teamData.goals );
				$( div ).append( "<br>Goals Against: " + teamData.goalsAgainst );
				$( div ).append( "<br>Goal Difference: " + teamData.goalDifference );
				$( div ).append( "<br>Wins: " + teamData.wins );
				$( div ).append( "<br>Draws: " + teamData.draws );
				$( div ).append( "<br>Losses: " + teamData.losses );
			}
		}
	});
}

function teamSelectChanged( element )
{
	updateTeamName( element );
	
	switch( teamView )
	{
		case -1:
		{
			teamView = TEAM_VIEW_STATS;
			break;
		}
		
		case TEAM_VIEW_STATS:
		{
			break;
		}
		
		case TEAM_VIEW_LASTROUND:
		{
			loadFixture( 1 );
			return;
		}
		
		case TEAM_VIEW_LAST5:
		{
			loadFixture( 5 );
			return;
		}
		
		case TEAM_VIEW_PLAYERS:
		{
			loadPlayerList();
			return;
		}
		
		case TEAM_VIEW_ALL:
		{
			showAllGames( -1 );
			return;
		}
	}
	
	var x = document.getElementById( "team-select" );
	
	if( x.value == "" )
	{
		return;
	}
	
	var title = document.getElementById( "content-navbar-id" );
	var text = element.options[ element.selectedIndex ].text;
	
	title.innerHTML = "<h2>" + text + "</h2>";
	
	$('#league-table-content').css({"display":"none"});
	$('#team-content-wrapper').css({"display":"block"});
	
	showCurrentStats();
	loadCompareList();
}

function updateTeamName( element )
{
	var title = document.getElementById( "content-navbar-id" );
	var text = element.options[ element.selectedIndex ].text;
	
	title.innerHTML = "<h2>" + text + "</h2>";
}

function compareTeamChanged()
{
	showOpponentStats();
}

/*
function loadFixture( x )
{
	if( x == 1 )
		teamView = TEAM_VIEW_LASTROUND;
	else if( x == 5 )
		teamView = TEAM_VIEW_LAST5;
	
	document.getElementById( "team-content" ).innerHTML = "";
	var url = document.getElementById( "team-select" ).value + "/fixtures";
	
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: url,
		dataType: 'json',
		type: 'GET',
	}).done( function( fixtureData )
	{
		var length = fixtureData.fixtures.length - 1;

		for( var i = length; i > length - x; i-- )
		{	 
			var newFixture= "<div>" +
			                  "<h4> Home: "+fixtureData.fixtures[i].homeTeamName+" Goals: "+fixtureData.fixtures[i].result.goalsHomeTeam+
			                  " &emsp;&emsp;&emsp; Away: "+fixtureData.fixtures[i].awayTeamName+" Goals: "+fixtureData.fixtures[i].result.goalsAwayTeam+"</h4>"+   
			                "</div>";
			$( "#team-content" ).append( newFixture );
		}
	});
}
*/

function showAllGames( x )
{
	teamView = TEAM_VIEW_ALL;
	
	document.getElementById( "team-content" ).innerHTML = "";
	
	var url = document.getElementById( "team-select" ).value + "/fixtures";
	var teamUrl = document.getElementById( "team-select" ).value;
	
	$.ajax(
	{
		headers: { 'X-Auth-Token': '874dfcb875f64bd5835f9b3229ea14f5' },
		url: url,
		dataType: 'json',
		type: 'GET',
	}).done( function( fixtureData )
	{
		var length = fixtureData.fixtures.length;
		
		$( "#team-content" ).append( "<table id = \"round-table\" style = \"width: 100%\"><tr><th>Round</th><th>Location</th><th>Opponent</th><th>Goals For</th><th>Goals Against</th><th>Result</th></tr>" );
		
		if( x == -1 )
			x = length;
		
		for( var i = length - 1 ; i > length - x - 1 ; i -- )
		{	 
			var fixture = fixtureData.fixtures[ i ];
			
			if( fixture._links.homeTeam.href == teamUrl )
			{
				var goalsFor = fixture.result.goalsHomeTeam;
				var goalsAgainst = fixture.result.goalsAwayTeam;
				
				var res = "";
				if( goalsFor > goalsAgainst )
					res = "Win";
				else if( goalsFor < goalsAgainst )
					res = "Loss";
				else
					res = "Draw";
				
				$( "#round-table" ).append( "<tr><td>" + ( i + 1 ) + "</td><td>Home</td><td>" + fixture.awayTeamName + "</td><td>" + goalsFor + "</td><td>" + goalsAgainst + "</td><td>" + res + "</tr>" );
			}
			else
			{
				var goalsFor = fixture.result.goalsAwayTeam;
				var goalsAgainst = fixture.result.goalsHomeTeam;
				
				var res = "";
				if( goalsFor > goalsAgainst )
					res = "Win";
				else if( goalsFor < goalsAgainst )
					res = "Loss";
				else
					res = "Draw";
				
				$( "#round-table" ).append( "<tr><td>" + ( i + 1 ) + "</td><td>Away</td><td>" + fixture.homeTeamName + "</td><td>" + goalsFor + "</td><td>" + goalsAgainst + "</td><td>" + res + "</tr>" );
			}
		}
		
		$( "#team-content" ).append( "</table>" );
	});
}