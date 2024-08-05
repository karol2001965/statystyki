describe('Example Test Suite', () => {
  //7
  const links = [
    ["https://www.livesport.com/pl/druzyna/rakow-czestochowa/SQOrbYim/wyniki/", "Raków Częstochowa"],
    ["https://www.livesport.com/pl/druzyna/jagiellonia-bialystok/lIDaZJTc/wyniki/","Jagiellonia Białystok"],
    // ["https://www.livesport.com/pl/druzyna/cracovia-krakow/KvXSf2A6/wyniki/","Cracovia"],
    // ["https://www.livesport.com/pl/druzyna/gornik-zabrze/2LH3Ywq4/wyniki/","Górnik Zabrze"],
    // ["https://www.livesport.com/pl/druzyna/korona-kielce/pp78XcbA/wyniki/","Korona Kielce"]
  ];
  //10
//   const links = [
//     ["https://www.livesport.com/pl/druzyna/legia-warszawa/K6kUepBs/wyniki/", "Legia Warszawa"],
//     [,],
//   ];
//   //6
//   const links = [
//     ["https://www.livesport.com/pl/druzyna/pogon-szczecin/Um9YwPQ0/wyniki/", "Pogoń Szczecin"],
//     ["https://www.livesport.com/pl/druzyna/widzew-lodz/rNOIW3uC/wyniki/","Widzew Łódź"],
//     ["https://www.livesport.com/pl/druzyna/lech-poznan/OpNH7Ouf/wyniki/","Lech Poznań"],
//     ["https://www.livesport.com/pl/druzyna/stal-mielec/pxXiDZkQ/wyniki/","Stal Mielec"],
//     ["https://www.livesport.com/pl/druzyna/zaglebie-lubin/tlYOere0/wyniki/","Zagłębie Lubin"]
//   ];
//   //9
//   const links = [
//     ["https://www.livesport.com/pl/druzyna/piast-gliwice/ve2oT9ck/wyniki/", "Piast Gliwice"],
//     ["https://www.livesport.com/pl/druzyna/gks-katowice/K4AgRmS1/wyniki/","GKS Katowice"],
//     ["https://www.livesport.com/pl/druzyna/motor-lublin/IoLk2VlL/wyniki/","Motor Lublin"],
//     ["https://www.livesport.com/pl/druzyna/puszcza/dtqx13O8/wyniki/","Puszcza Niepołomice"]
//   ];
//   //5
//   const links = [
//     ["https://www.livesport.com/pl/druzyna/radomiak-radom/zD5nYhAT/wyniki/", "Radomiak Radom"],
//     ["https://www.livesport.com/pl/druzyna/lechia-gdansk/GGLmkiK8/wyniki/","Lechia Gdańsk"],
//   ];
// //8
// const links = [
//   ["https://www.livesport.com/pl/druzyna/slask-wroclaw/E1Oxemse/wyniki/", "Śląsk Wrocław"],
// ];
  links.forEach(link => {
    const url = link[0];
    const nazwa = link[1];

    it(`should log href value of the first 3 event matches and check values for ${nazwa}`, () => {
      // const co = "Faule";
      // const co = "Żółte kartki";
      const co = "Rzuty rożne";
      // const co = "Spalone";

      cy.visit(url);

      const urls = [];
      let totalValueToAdd = 0; // Zmienna do przechowywania sumowanej wartości

      // Poczekaj na załadowanie strony i znajdź wszystkie elementy .event_match
      cy.get('.event__match')
        .each(($element, index) => {
          if (index > 7 && index < 12 ) { // Ogranicz do pierwszych 3 elementów
            // Znajdź pierwszy <a> wewnątrz każdego elementu .event_match
            cy.wrap($element)
              .find('a')
              .first()
              .invoke('attr', 'href')
              .then(href => {
                // Modyfikuj URL do dodania statystyk meczu
                const statsUrl = href.replace('/szczegoly-meczu', '/szczegoly-meczu/statystyki-meczu/0');
                // Dodaj zmodyfikowany URL do tablicy urls
                urls.push(statsUrl);
                // Logowanie zmodyfikowanego URL-a
                cy.log('Modified URL added to list: ' + statsUrl);
              });
          }
        })
        .then(() => {
          // Po zakończeniu pętli .each(), wykonaj testy dla każdego zebranego URL-a
          cy.wrap(urls).each(url => {
            cy.log(`Processing URL: ${url}`);

            cy.visit(url);

            cy.get('.duelParticipant__away > .participant__participantNameWrapper > div.participant__participantName > .participant__participantName')
              .invoke('text')
              .then(teamName => {
                cy.log(`Team Name: ${teamName}`);

                if (!teamName.includes(nazwa)) {
                  cy.get(`div._category_1ague_4:has(strong:contains(${co}))`).prev('div').find('[data-testid="wcl-scores-simpleText1"]')
                    .then($element => {
                      const valueToAdd = parseInt($element.text().trim(), 10); // Zamiana na liczbę całkowitą
                      totalValueToAdd += valueToAdd; // Dodanie wartości do sumy
                      cy.log(`Value from ${url}: ${valueToAdd}`);
                    })

                } else {
                  cy.get(`div:has(strong:contains(${co})) + div:first [data-testid="wcl-scores-simpleText1"]`)
                    .then($element => {
                      const valueToAdd = parseInt($element.text().trim(), 10); // Zamiana na liczbę całkowitą
                      totalValueToAdd += valueToAdd; // Dodanie wartości do sumy
                      cy.log(`Value from ${url}: ${valueToAdd}`);
                    })


                }
              });
          }).then(() => {
            // Po zakończeniu testów, oblicz średnią wartość totalValueToAdd przez ilość URL-i
            const averageValueToAdd = totalValueToAdd / urls.length;
            cy.log(`Total Value to Add: ${totalValueToAdd}`);
            cy.log(`Average Value to Add per URL: ${averageValueToAdd}`);
            cy.writeFile('cypress/fixtures/numbers.log', nazwa + " " + averageValueToAdd + '\n', { flag: 'a+' });
          });
        });
    });
  });
});