$(document).ready(function(){

	var current_logged_username;

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
	});
	
	function ajaxPost_AddAccount(){
		var accountData = {};
		accountData.forename = $('#createAccount_forename').val();
		accountData.surname = $('#createAccount_surname').val();
		accountData.username = $('#createAccount_username').val();
		accountData.password = $('#createAccount_password').val();
		accountData.access_token = 'concertina';
		$('#account-username-duplicate-error').hide(500);
		$('#account-unauthorised-error').hide(500);
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(accountData),
			dataType: 'json',			
			url: window.location.origin + '/people',
			success: function(result){
				$('#account-modal').modal('toggle');
				console.log(JSON.stringify(result));
				ajaxGet_loadAccountTable();
			},
			error: function(e){
				if(e.status = 400){
					console.log("Username already exists");
					$('#account-username-duplicate-error').show(500);
				}else if(e.status = 403){
					console.log("User not authorised to make request");
					$('#account-unauthorised-error').show(500);
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
	});

	function ajaxPost_LoginToAccount(){
		var accountData = {};
		accountData.username = $('#login_username').val();
		accountData.password = $('#login_password').val();
		$('#login-error').hide(500);
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(accountData),
			dataType: 'json',			
			url: window.location.origin + '/login',
			success: function(result){
				$('#login-modal').modal('toggle');
				$('#navbarSignup').attr("class", "hide");
				$('#navbarLogin').attr("class", "hide");
				$('#navbarLogout').removeClass("hide");
				current_logged_username = accountData.username;
				$.ajaxSetup({
					headers: {
						'Authorization' : "bearer " + result.token
					}
				});
			},
			error: function(e){
				if(e.status = 400){
					$('#login-error').show(500);
					console.log("Incorrect username or password entered");
				}else{
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
	




	$('#addNewFight').submit(function(event){
		event.preventDefault();
		ajaxPost_AddFight();
	})

	function ajaxPost_AddFight(){
		var fightData = {};
		fightData.current_logged_username = current_logged_username;
		fightData.username_1 = $('#addfight-username1').val();
		fightData.username_2 = $('#addfight-username2').val();
		fightData.id = $('#addfight-id').val();
		fightData.location = $('#addfight-location').val();
		fightData.noOfRounds = $('#addfight-rounds').val();
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(fightData),
			dataType: 'json',			
			url: window.location.origin + '/addfight',
			success: function(result){
				console.log(JSON.stringify(result));
				ajaxGet_loadFightTables();
			},
			error: function(e){
				if(e.status = 401){
					alert("You must be logged in to do that");
					console.log("ERROR: ", e);
				}else{
					alert("Unknown Error");
					console.log("ERROR: ", e);
				}
			}
		});	
	}





	$('#contact').submit(function(event){
		event.preventDefault();
		$('#contactName').val("");
		$('#contactEmail').val("");
		$('#contactComment').val("");
	})





	function ajaxGet_loadAccountTable(){
		$.ajax({
			type: 'GET',
			url: window.location.origin + "/people",
			success: function(accounts){
				$('#tbody_accounts').empty();
				$.each(accounts, function(i, account){
					var eachrow = "<tr>" 
					+ "<td>" + account.forename + "</td>"
					+ "<td>" + account.surname + "</td>" 
					+ "<td>" + account.username + "</td>" + "</tr>";
					$('#tbody_accounts').append(eachrow);
				});
			},
			error: function(e){
				console.log("ERROR: ", e);
			}
		});
	}





	function ajaxGet_loadFightTables(){
		$.ajax({
			type: 'GET',
			url: window.location.origin + "/fights",
			success: function(fights){
				$('#tbody_fights').empty();
				$.each(fights, function(i, fight){
					var eachrow = "<tr>" 
					+ "<td>" + fight.username_1 + "</td>"
					+ "<td>" + fight.username_2 + "</td>"
					+ "<td>" + fight.id + "</td>"
					+ "<td>" + fight.location + "</td>"
					+ "<td>" + fight.noOfRounds + "</td>" 
					+ "</tr>";
					$('#tbody_fights').append(eachrow);				
				});
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


	// Loads the table data
	ajaxGet_loadAccountTable();
	ajaxGet_loadFightTables();
});