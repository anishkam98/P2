class GameUtility {
    flippedCards = 0;
    guesses = 0;
    correctGuesses = 0;
    firstGuess;
    secondGuess;

    loadCards() {
        const cardImageMap = new Map()
        const numberOfCards = localStorage.numberOfCards ?? defaultNumberOfCards
        const numberOfRows = numberOfCards / 8
        const numberOfPairs = numberOfCards / 2 + 1
    
        for(let i=1;i<numberOfPairs;i++) {
            const cardImage = cardImgSrcStart + String(i) + '.png'
            cardImageMap.set(cardImage, new Set())
        }
        
        for(let i=1;i<numberOfRows+1;i++) {
            const row = document.createElement('div')
            row.id = "row-" + String(i)
    
            for(let j=0;j<8;j++) {
                const id = String(i+(i*j))
                const card = document.createElement('div')
                const cardImageElement = document.createElement('img')
                const backImageElement = document.createElement('img')
                let shouldFindPair = true
                
                card.id = "card-" + id
                backImageElement.src = backImgSrc
                backImageElement.alt = 'Back of card'
                backImageElement.style.opacity = 1
            
    
                while(shouldFindPair) {
                    const cardImage = cardImgSrcStart + Math.floor((Math.random() * 24) + 1) + '.png'
    
                    if (cardImageMap.has(cardImage) && !cardImageMap.get(cardImage).has(id) && cardImageMap.get(cardImage).size < 2) {
                        cardImageMap.get(cardImage).add(id)
                        cardImageElement.src = cardImage
                        cardImageElement.hidden = true
                        cardImageElement.style.opacity = 0
                        shouldFindPair = false
                    }
                }
    
                card.appendChild(backImageElement)
                card.appendChild(cardImageElement)
    
                // add click evesnt handler for each card link
                card.addEventListener("click", () => {
                    if(!card.classList.contains('disabled')) {
                        this.flipCard(card)
                    }

                    const numberOfCards = localStorage.numberOfCards ? localStorage.numberOfCards/2 : (defaultNumberOfCards/2)
                    if(this.correctGuesses === numberOfCards) {
                        const accuracy = Math.round(this.correctGuesses/this.guesses * 100)
                      
                        getElement('#correct').textContent = String(accuracy) + '%'
                        if(!localStorage.highScore || localStorage.highScore < accuracy){
                            localStorage.highScore = accuracy
                            renderHighScore()
                        }
                    }
                })
    
                row.appendChild(card)
            }
            getElement("#cards").appendChild(row)
            
        }
    }

    flipCard(card) {
        if(this.flippedCards < 2) {
            this.animateCardFlip(card.firstElementChild)
            this.animateCardFlip(card.lastElementChild)

            if(this.flippedCards === 0) {
                this.firstGuess = card
                this.flippedCards += 1
            }
            else if(this.flippedCards === 1) {
                this.secondGuess = card
                this.flippedCards += 1
            }

            if(this.flippedCards === 2) {
                this.checkforMatch()
            }
        }
        else {
            this.animateCardFlip(card.firstElementChild)
            this.animateCardFlip(card.lastElementChild)
        }
    }

    animateCardFlip(element) {
        let opacity = Number(element.style.opacity)
        
        if(opacity === 0) {
            element.hidden = !element.hidden
    
            let interval
            interval = setInterval(function() {
    
                if (opacity < 1) { 
                    opacity += 0.25
                    element.style.opacity = String(opacity);
                } 
                else { 
                    clearInterval(interval)
                } 
            }, 100)
        }
        else if(opacity === 1) {
            element.hidden = !element.hidden
            element.style.opacity = 0
        }
    }

    checkforMatch() {
        if(this.doCardsMatch()) {
            this.correctGuesses += 1
            this.guesses += 1

            setTimeout(() => {
                this.disableCard(this.firstGuess)
                this.disableCard(this.secondGuess)
                this.flippedCards = 0
            }, 1000);
        }
        else {
            this.guesses += 1

            setTimeout(() => {
                this.flipCard(this.firstGuess)
                this.flipCard(this.secondGuess)
                this.flippedCards = 0
            }, 1000);
        }
    }

    doCardsMatch() {
        return this.firstGuess.lastElementChild.src === this.secondGuess.lastElementChild.src;
    }

    disableCard(card) {
        card.lastElementChild.src = blankImgSrc
        card.firstElementChild.src = blankImgSrc
        card.classList.add('disabled')
    }

    saveGameSettings() {
        localStorage.playerName = getElement("#player_name").value
        localStorage.numberOfCards = getElement("#num_cards").value
        window.location.reload()
    }

    reset() {
        this.guesses = 0
        this.correctGuesses = 0
        this.flippedCards = 0
        this.firstGuess = undefined
        this.secondGuess = undefined
    }
}