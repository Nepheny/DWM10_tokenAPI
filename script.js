const apiKey = '35cf665dc0c0635ccd20e7955d05d8dd';

$(document).ready(function () {

  $('#a').on('click', function (e) {
    document.querySelector('.loading-container').classList.remove('hidden');
    $.ajax({
      url: "https://api-2445582011268.apicast.io/games/count",
      type: "GET",
      headers: {
        'user-key': apiKey,
        'Accept': 'application/json',
      },
      success: function (games) {
        let gameCount = games.count;
        let gameNumber = Math.floor((Math.random() * gameCount) + 1);
        $.ajax({
          url: "https://api-2445582011268.apicast.io/games/" + gameNumber,
          type: "GET",
          headers: {
            'user-key': apiKey,
            'Accept': 'application/json',
          },
          success: function (response) {
            showPlatformsRequest(response);

            document.querySelector('main').innerHTML = "";
            const containerDiv = document.createElement('div');
            const title = document.createElement('h2');
            const summary = document.createElement('p');
            const cover = document.createElement('img');
            const imgDiv = document.createElement('div');
            const progressDiv = document.createElement('div');
            const platformContainer = document.createElement('div');

            imgDiv.classList.add('size-img');
            containerDiv.classList.add('container');
            platformContainer.classList.add('platform-container');

            if (response === []) {
              title.innerHTML = "No game";
            } else {
              title.innerHTML = response[0].name;
            }
            if (response[0].summary === undefined) {
              summary.innerHTML = "No summary for this game";
            } else {
              summary.innerHTML = response[0].summary;
            }

            if (response[0].cover === undefined) {
              const noImg = document.createElement('p');
              noImg.innerHTML = "No image";
              imgDiv.appendChild(noImg);
            } else {
              cover.src = response[0].cover.url;
            }

            if (response[0].aggregated_rating === undefined) {
              progressDiv.innerHTML = "No rate for this game"
            } else {
              const rate = response[0].aggregated_rating;
              progressBar(rate, progressDiv);
            }

            imgDiv.appendChild(cover);
            containerDiv.appendChild(imgDiv);
            containerDiv.appendChild(title);
            containerDiv.appendChild(summary);
            containerDiv.appendChild(progressDiv);
            containerDiv.appendChild(platformContainer);
            
            document.querySelector('main').appendChild(containerDiv);
            document.querySelector('.loading-container').classList.add('hidden');
          }
        });
      }
    });
  });
});

function showPlatformsRequest(response) {
  if (response[0].platforms !== undefined) {
    const platforms = response[0].platforms;
    for (let i = 0; i < platforms.length; i++) {
      $.ajax({
        url: "https://api-2445582011268.apicast.io/platforms/" + platforms[i],
        type: "GET",
        headers: {
          'user-key': apiKey,
          'Accept': 'application/json',
        },
        success: function (response) {
          showPlatform(response);
        }
      });
    }
  }
}

function showPlatform(platform) {
  const platformName = platform[0].name;
  const plateformLogo = platform[0].logo.url;

  const name = document.createElement('h3');

  name.innerHTML = platformName;

  document.querySelector('.platform-container').appendChild(name);
}

function progressBar(rate, progressDiv) {
  let bar = new ProgressBar.Line(progressDiv, {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#0066ff',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {
      width: '100%',
      height: '100%',
    },
    text: {
      style: {
        // Text color.
        // Default: same as stroke color (options.color)
        color: '#333',
        position: 'inherit',
        right: '0',
        top: '30px',
        padding: 0,
        margin: 0,
        transform: null
      },
      autoStyleContainer: false
    },
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    step: (state, bar) => {
      bar.setText(rate + '%');
    }
  });
  bar.set(rate / 100);
}

// response[0].platforms

// Pour désactiver la sécurité sur Chrome quand on développe en local (Chrome interdit l'accès):
// /usr/bin/google-chrome-stable %U --disable-web-security --user-data-dir