// ==UserScript==
// @name         Neopets: Highlight Followed Users
// @description  Underlines topics made by followed users, highlights their replies. Look for the settings gear in the buffer to edit colors.
// @version      1.2.0
// @author       sunbathr & rawbeee
// @match        http://www.neopets.com/neoboards/boardlist*
// @match        http://www.neopets.com/neoboards/topic*
// @require      http://code.jquery.com/jquery-latest.js
// @require      http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

var FollowedBylineColors = GM_SuperValue.get("FollowedBylineColorsNeopets", `#EDFCF8`);
var FollowedUnderlineColors = GM_SuperValue.get("FollowedUnderlineColorsNeopets", `#3B54B4`);

$(`<style type='text/css'>
.postAuthorPetIcon img {
  border: 0px !important;
  border-radius: 3px;
}
div.boardPostByline {
  position: relative;
}
div.boardPost {
  position: relative;
}
div.postPetInfo {
  margin-bottom: 10px;
}
div.postPet {
  margin: 0px 0px 10px 0px;
}
.follow {
transition-duration: 0.2s;
}
.follow:hover {
transform: translateY(-2px);
}
.boardPostByline {
transition: background-color 1s ease;
}
.togglePopup__2020.settingspopup {
  max-width:40%;
  left: 30%;
  top: 27%;
z-index:100;
}
</style>`).appendTo("head");

var followedUsers = GM_SuperValue.get("FollowedUsersNeopets", []);

function highlightFollowedUsers() {
  $("#boardList li").each(function(i, board) {
      if($.inArray($(board).find( ".author" ).text().replace(/[^a-zA-Z 0-9 _]+/g, ''), followedUsers) !== -1) {
          $(board).find( ".boardTopicTitle span" ).css("border-bottom", `3px solid` + FollowedUnderlineColors + ``);
      }
  });
}


function followToggle() {
    $(".boardPostByline").each(function(i, byline) {
        var user = $(byline).find( ".postAuthorName" ).text().replace(/[^a-zA-Z 0-9 _]+/g, '');
        if($.inArray(user, followedUsers) !== -1) {
            $(byline).append( '<div class="follow" style="cursor: pointer; color: #999; font-size: 10px; position:absolute; bottom:0;"><p>UNFOLLOW</p></div>' );
            $(byline).css("background-color", FollowedBylineColors);
        }
        else {
            $(byline).append( '<div class="follow" style="cursor: pointer; color: #999; font-size: 10px; position:absolute; bottom:0;"><p>FOLLOW</p></div>' );
            $(byline).css("background-color", "#f3f3f3");
        }
    });
    $('.follow').click(function() {
         var updatingUser = $(this).parent().find( ".postAuthorName" ).text();
         if($.inArray(updatingUser, followedUsers) !== -1) {
             var newFollowedUsers = followedUsers.filter(function(elem) {
                 return elem != updatingUser;
             });
             followedUsers = newFollowedUsers;
         }
         else {
             followedUsers.push(updatingUser);
         }
        GM_SuperValue.set ("FollowedUsersNeopets", followedUsers);
        $(".follow").remove();
        followToggle();
     });
}

function addSettings() {
        var settings_pop = `<div class="togglePopup__2020 movePopup__2020 settingspopup" id="settings_pop" style="display:none;">
		<div class="popup-header__2020">
			<h3>Neoboard-enhancement-suite Settings</h3>


<div class="popup-header-pattern__2020"></div>
		</div>
		<div class="popup-body__2020" style="background-color: #f0f0f0; border: solid 2px #f0f0f0;">
<font style="font-size:10pt;">Enter your choice of color in hex format and save. Refresh to view changes.</font>
<div id="nes_settings">

</div>
		</div>
		<div class="popup-footer__2020 popup-grid3__2020">
			<div class="popup-footer-pattern__2020"></div>
		</div>
	</div>`;

    var settings = `
<h4>Neoboard Followed Users Colors:</h4>

<table style="margin-left: auto; margin-right: auto;">
<tr class="byline_update">
<p><td><label for="FollowedBylineColor">Byline Color:</label></td>
<td><input type="text" id="FollowedBylineColor" name="FollowedByline" value="` + FollowedBylineColors + `"></td>
<td><button id="saveFollowedBylineColorButton">Save</button></td>
</tr>
<tr class="underline_update">
<td><label for="FollowedUnderline">Underline Color:</label></td>
<td><input type="text" id="FollowedUnderlineColor" name="FollowedUnderlineColor" value="` + FollowedUnderlineColors + `"></td>
<td><button id="saveFollowedUnderlineColorButton">Save</button></td>
</tr>
</table></p><p></p>`;
    if ($("#settings_pop").length > 0) {
        $("#nes_settings").append(settings);
    var modal = document.getElementById("settings_pop");
    var btn = document.getElementById("settings_btn");

$('#settings_btn').click(function() {
    if (modal.style.display !== "none"){
		modal.style.display = "none";
	} else {
		modal.style.display = "block";
	}
});

$('html').click(function(event) {
    if ($(event.target).closest('#settings_btn, #settings_pop').length === 0) {
        modal.style.display = "none";
    }
});
    }
    else {
    $(`.navsub-left__2020`).append(`<span class="settings_btn" id="settings_btn" style="cursor:pointer;"><img src="http://images.neopets.com/themes/h5/basic/images/v3/settings-icon.svg" style="height:30px; width:30px;"></span>`);
    $(settings_pop).appendTo("body");
    $("#nes_settings").append(settings);
    }
    document.getElementById ("saveFollowedBylineColorButton").addEventListener ("click", saveFollowedBylineColor);
    document.getElementById ("saveFollowedUnderlineColorButton").addEventListener ("click", saveFollowedUnderlineColor);
}

function saveFollowedBylineColor() {
    var clicked_bc = document.getElementById("FollowedBylineColor").value;
    GM_SuperValue.set ("FollowedBylineColorsNeopets", clicked_bc);
    $(".byline_update").after(`<tr><td></td><td><font style="font-size: 10pt; color:` + clicked_bc + `;">Updated.</font></td><td></td></tr>`);
}

function saveFollowedUnderlineColor() {
    var clicked_uc = document.getElementById("FollowedUnderlineColor").value;
    GM_SuperValue.set ("FollowedUnderlineColorsNeopets", clicked_uc);
    $(".underline_update").after(`<tr><td></td><td><font style="font-size: 10pt; color:` + clicked_uc + `;">Updated.</font></td><td></td></tr>`);
}

document.addEventListener('DOMContentLoaded', highlightFollowedUsers);
document.addEventListener('DOMContentLoaded', followToggle);
document.addEventListener('DOMContentLoaded', addSettings);
