function startGame ( ) {

  var fPlayerNode ;

  // Static Nodes
  var fExitNode ;
  var fExitPosition ;
  
  var fPlayAreaNode ;
  var fPlayAreaBounds ;
  var fGameWrapper ;

  var fStartNode ;
  var fStartPosition ;

  var fLevel ;

  var fDangers ;

  var fPlaying ;

  init ( ) ;

  return;

  function init ( ) {
    animateSprite( '.animate-sprite-sheet', '.player', 50, 30 )

    fGameWrapper       = document.querySelector(".game-wrapper"); 
    fPlayerNode        = document.querySelector(".player");
    fExitNode          = document.querySelector(".exit");
    fStartNode         = document.querySelector(".start");
    fPlayAreaNode      = document.querySelector(".game-board");
    fStartScreen       = document.querySelector(".start-screen");
    fFinishedScreen    = document.querySelector(".finished-screen");
    fBeatLevelScreen   = document.querySelector(".beat-level-screen");
    fFailedLevelScreen = document.querySelector(".failed-level-screen");

    fDangers = [];

    // fMenuButton     = document.querySelector(".menu-button");

    fLevel = 1;

    fPlaying = false ;

    sizeGameboard( );

    // Static Nodes
    fExitPosition   = fExitNode.getBoundingClientRect( );
    fStartPosition  = fStartNode.getBoundingClientRect( );
    fPlayAreaBounds = fPlayAreaNode.getBoundingClientRect( );

    // Click Events
    // fMenuButton.onclick  = function(){menuButton( );};

    beginLevel( );

  }

  function sizeGameboard ( ) {
    height = fGameWrapper.clientHeight ;
    width  = fGameWrapper.clientWidth ;

    fPlayAreaNode.style.height = (height - 200) + 'px';
    fPlayAreaNode.style.width  = (width - 300) + 'px';
  }

  function changeLevelStyleSheet(cssFile, cssLinkIndex) {

  var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

  var newlink = document.createElement("link");
  newlink.setAttribute("rel", "stylesheet");
  newlink.setAttribute("type", "text/css");
  newlink.setAttribute("href", cssFile);

  document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
  }

  function clearScreens ( ) {
    fStartScreen.style.display       ='none';       
    fFinishedScreen.style.display    ='none';    
    fBeatLevelScreen.style.display   ='none';   
    fFailedLevelScreen.style.display ='none'; 
  }

  function setUpLevel ( ) {

    changeLevelStyleSheet('level'+fLevel+'.css', 1);

    clearScreens( ) ;

    fPlaying = true ;
    fDangers = document.getElementsByClassName("danger");

    if ( fDangers.length < fLevel ) {
      var baddie = document.createElement("div");

      baddie.setAttribute("class", "laser-attributes laser" + fLevel + " danger")

      fPlayAreaNode.appendChild(baddie);

    } else {

      fLevel = 1 ;
    }
  }

  function beginLevel ( ) {
    window.onresize = checkBoardState ;
  }

  function failedLevel ( ) {
    fPlaying = false ;
    fFailedLevelScreen.style.display='block';
    console.log("you lose");
  }

  function passedLevel ( ) {
    fPlaying = false ;
    fBeatLevelScreen.style.display='block';
    console.log("you win");
    fLevel++ ;
  }

  function menuButton ( ) {   // This should be fixed
    
  }

  function checkBoardState ( ) {
    if ( fPlaying === false ) {
      var startLevel = characterPosition( checkCollision, fStartPosition ) ;
      if ( startLevel === true ) setUpLevel( );  

    } else {
      var endReached = characterPosition( checkCollision, fExitPosition ) ;
      if ( endReached === true ) passedLevel( );

          var offBoard = characterPosition( checkCollision, fPlayAreaBounds ) ;
      if ( offBoard !== true ) failedLevel( );

      if ( fDangers !== undefined ) {
        for (var i = 0; fDangers.length > 0; i++) {
          if ( fDangers[i] === undefined ) return ;
          var dangerPosition   = fDangers[i].getBoundingClientRect( );

          var captured = characterPosition( checkCollision, dangerPosition ) ;
          if ( captured === true ) failedLevel( );
        }
      }
    }
  }

  function characterPosition ( callback, obj2 ) {
    var playerPosition = fPlayerNode.getBoundingClientRect( );

    return callback( playerPosition, obj2);

  } 

  function checkCollision ( objectA, objectB ) {
    return !(objectA.right < objectB.left || 
            objectA.left > objectB.right  || 
            objectA.bottom < objectB.top  || 
            objectA.top > objectB.bottom);
   
  }

  function animateSprite( spriteSheetClass, viewHoleClass, animationSpeed, maxFrameNumber ) {

    var fSprites = document.querySelector(spriteSheetClass);
    var fViewHole = document.querySelector(viewHoleClass);

    beginAnimationProcess ( startAnimation )

    return ;

    function beginAnimationProcess ( callback ) {
      var viewHoleHeight = fViewHole.clientHeight;
      var viewHoleWidth = fViewHole.clientWidth;

      var imageHeight = fSprites.clientHeight;
      var imageWidth = fSprites.clientWidth;

      var framesWide = Math.round(imageWidth/viewHoleWidth);
      var framesTall = Math.round(imageHeight/viewHoleHeight);

      if ( maxFrameNumber !== undefined ) {
        var totalFrames = maxFrameNumber;
      } else {
        var totalFrames = framesWide*framesTall;
      }

      callback( viewHoleHeight, viewHoleWidth, framesWide, framesTall, totalFrames );

    }


    function startAnimation ( viewHoleHeight, viewHoleWidth, framesWide, framesTall, totalFrames ) {

      function animate(timestamp) {

        var frameNumber = (Math.floor(timestamp/animationSpeed))%(totalFrames);

        var rightShift = frameNumber%framesWide;
        var downShift  = Math.floor(frameNumber/framesWide)%framesTall;

        var moveSide   = rightShift*viewHoleWidth;
        var moveUpDown = downShift*viewHoleHeight;

        fSprites.style.transform = "translate( -" + moveSide + "px, -" + moveUpDown + "px)";

        requestAnimationFrame(animate);

      }

      requestAnimationFrame(animate);
    }

  }
}
