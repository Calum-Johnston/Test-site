$(document).ready(function(){

	//Script specifically for smooth scrolling
	$(".navbar a, footer a[href='#main']").on("click", function(event){
		if(this.hash !== ""){
			event.preventDefault();
			var hash = this.hash;
			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 900, function(){
				window.location.hash = hash;
			})
		}
	});





	//Script for loading elements into page when scrolling
	$(window).scroll(function(){
		$(".slide-feature").each(function(){
			var position = $(this).offset().top;
			var windowTop = $(window).scrollTop();
			if(position < windowTop + 600){
				$(this).addClass("slide");
			}
		})
	})





	//On submitting the form, this is run
	$("#addNewAccount").submit(function(event){
		event.preventDefault();
		ajaxPost_AddAccount();
		$('#account-modal').modal('toggle');
	});
	
	function ajaxPost_AddAccount(){
		var accountData = {};
		accountData.forename = $('#createAccount_forename').val();
		accountData.surname = $('#createAccount_surname').val();
		accountData.username = $('#createAccount_username').val();
		accountData.password = $('#createAccount_password').val();
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(accountData),
			dataType: 'json',			
			url: window.location + 'people',
			success: function(result){
				console.log(JSON.stringify(result));
				ajaxGet_loadAccountTable();
			},
			error: function(e){
				if(e.status = 400){
					console.log("Username already exists");
					alert("Cannot make account - Username already exists");
				}else if(e.status = 403){
					console.log("User not authorised to make request");
					alert("Invalid access token, please refresh the page");
				}else{
					alert("Error");
					console.log("ERROR: ", e);
				}
			}
		});	
		clearAccountData();		
	};

	function clearAccountData(){
		$('#createAccount_forename').val("");
		$('#createAccount_surname').val("");
		$('#createAccount_username').val("");
		$('#createAccount_password').val("");
	}





	$('#loginToAccount').submit(function(event){
		event.preventDefault();
		ajaxPost_LoginToAccount();
		$('#login-modal').modal('toggle');
	});

	function ajaxPost_LoginToAccount(){
		var accountData = {};
		accountData.username = $('#login_username').val();
		accountData.password = $('#login_password').val();
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(accountData),
			dataType: 'json',			
			url: window.location + 'login',
			success: function(result){
				$('#navbarSignup').attr("class", "hide");
				$('#navbarLogin').attr("class", "hide");
				$('#navbarLogout').removeClass("hide");
				console.log(result.token);
				$.ajaxSetup({
					headers: {
						'Authorisation' : "bearer " + result.token
					}
				});

			},
			error: function(e){
				console.log(e);
				if(e.status = 400){
					console.log("Incorrect username or password entered");
					alert("Incorrect Username/Password Entered");
				}else{
					alert("Unknown Error");
					console.log("ERROR: ", e);
				}
			}
		});	
		clearLoginData();
	}

	function clearLoginData(){
		$('#login_username').val("");
		$('#login_password').val("");
	}
	




	function ajaxGet_loadAccountTable(){
		$.ajax({
			type: 'GET',
			url: window.location + "people",
			success: function(accounts){
				console.log(accounts);
				$('#tbody_accounts').empty();
				$.each(accounts, function(i, account){
					var eachrow = "<tr>" 
					+ "<td>" + account.forename + "</td>"
					+ "<td>" + account.surname + "</td>" 
					+ "<td>" + account.username + "</td>" + "</tr>";
					$('#tbody_accounts').append(eachrow);
				});
				console.log("Success", accounts);
			},
			error: function(e){
				console.log("ERROR: ", e);
			}
		});
	}





	function ajaxGet_loadFightTables(){
		$.ajax({
			type: 'GET',
			url: window.location + "fights",
			success: function(fights){
				console.log(fights);
				$('#tbody_fights').empty();
				$.each(fights, function(i, fight){
					console.log(fight);
					var eachrow = "<tr>" 
					+ "<td>" + fight.username_1 + "</td>"
					+ "<td>" + fight.username_2 + "</td>"
					+ "<td>" + fight.id + "</td>"
					+ "<td>" + fight.location + "</td>"
					+ "<td>" + fight.noOfRounds + "</td>" 
					+ "</tr>";
					$('#tbody_fights').append(eachrow);				
				});
				console.log("Success", fights);
			},
			error: function(e){
				console.log("ERROR: ", e);
			}
		});
	};

	$('#navbarLogout').click(function(){
		$('#navbarSignup').removeClass("hide");
		$('#navbarLogin').removeClass("hide");
		$('#navbarLogout').attr("class", "hide");	
	});





	$('#addNewFight').submit(function(event){
		event.preventDefault();
		ajaxPost_AddFight();

	});

	function ajaxPost_AddFight(){
		var fightData = {};
		fightData.username_1 = $('#addfight-username1').val();
		fightData.username_2 = $('#addfight-username2').val();
		fightData.id = $('#addfight-id').val();
		fightData.location = $('#addfight-location').val();
		fightData.noOfRounds = $('#addfight-rounds').val();
		console.log(fightData);
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(fightData),
			dataType: 'json',			
			url: window.location + 'addfight',
			success: function(result){
				console.log("Hi");
				console.log(JSON.stringify(result));
				ajaxGet_loadFightTables();
			},
			error: function(e){
				alert("Error");
				console.log("ERROR: ", e);
			}
		});	
	}



	// Loads the table data
	ajaxGet_loadAccountTable();
	ajaxGet_loadFightTables();
});