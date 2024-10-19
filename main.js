"use strict";
const getElement = selector => document.querySelector(selector);

// image constants 
const backImgSrc = "images/back.png";
const blankImgSrc = "images/blank.png";
const cardImgSrcStart = "images/card_";
const util = new GameUtility();
const defaultNumberOfCards = 48

document.addEventListener("DOMContentLoaded", () => {
    // display cards and player info
    getElement("#player").textContent =  "Player: " + (localStorage.playerName ?? " ")
    util.loadCards()
    
    // load settings data
    getElement("#num_cards").value = localStorage.numberOfCards ?? defaultNumberOfCards
    if(localStorage.playerName) {
        getElement("#player_name").value = localStorage.playerName
    }
    if(localStorage.highScore) {
        renderHighScore()
    }

    // add click event handler for each tab link button
    getElement("#tabs_cards_link").addEventListener("click", () => {
        clickTab("#tabs_cards_link")
    })

    getElement("#tabs_rules_link").addEventListener("click", () => {
        clickTab("#tabs_rules_link")
    })

    getElement("#tabs_settings_link").addEventListener("click", () => {
        clickTab("#tabs_settings_link")
    })
    
    // add click event handler for Save Settings button
    getElement("#save_settings").addEventListener("click", () => {
        util.saveGameSettings()
    })  

    getElement("#new_game").addEventListener("click", () => {
        util.reset()
        util.loadCards()
    })
}); 

function clickTab(id) {
    if(getElement(id).classList.contains("active")){
        return;
    }

    const tabId = id.replace("_link", "").replace("#", "")
    document.querySelectorAll('.tabcontent').forEach((element) => {
        if(element.id == tabId) {
            element.classList.remove('hide')
        }
        else {
            element.classList.add('hide')
        }
    })

    id = id.replace("#", "")
    document.querySelectorAll('.tablinks').forEach((element) => {
        if(element.id == id) {
            element.classList.add('active')
        }
        else {
            element.classList.remove('active')
        }
    })
}

function renderHighScore() {
    getElement('#high_score').textContent = 'High Score: ' + localStorage.highScore + '%'
}