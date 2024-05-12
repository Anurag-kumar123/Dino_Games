export default class Player {
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    dinoRunImages = [];
  
    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;
  
    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
      this.ctx = ctx;
      this.canvas = ctx.canvas;
      this.width = width;
      this.height = height;
      this.minJumpHeight = minJumpHeight;
      this.maxJumpHeight = maxJumpHeight;
      this.scaleRatio = scaleRatio;
  
      this.x = 10 * scaleRatio;
      this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
      this.yStandingPosition = this.y;
  
      this.standingStillImage = new Image();
      this.standingStillImage.src = "images/standing_still.png";
      this.image = this.standingStillImage;
  
      const dinoRunImage1 = new Image();
      dinoRunImage1.src = "images/dino_run1.png";
  
      const dinoRunImage2 = new Image();
      dinoRunImage2.src = "images/dino_run2.png";
  
      this.dinoRunImages.push(dinoRunImage1);
      this.dinoRunImages.push(dinoRunImage2);
  
      //keyboard
      window.removeEventListener("keydown", this.keydown);
      window.removeEventListener("keyup", this.keyup);
  
      window.addEventListener("keydown", this.keydown);
      window.addEventListener("keyup", this.keyup);

      const video = document.getElementById('video')

      video.addEventListener('play', () => {
        // const canvas = faceapi.createCanvasFromMedia(video)
        // document.body.append(canvas)
        // const displaySize = { width: video.width, height: video.height}
        // faceapi.matchDimensions(canvas, displaySize)
        // video.style.transform = 'scale(-1, 1)'
        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
          // const resizedDetections = faceapi.resizeResults(detections, displaySize)
          if (detections) {
            // console.log(detections[0].expressions.happy >= 0.7)
            if (detections[0].expressions.happy >= 0.5 && !this.jumpInProgress && !this.jumpPressed) {
              this.jumpPressed = true;
              console.log(true)
              // this.jumpPressed = false;
            } else {
              this.jumpPressed = false;
            }
          }
          
          // this.jumpPressed = false;
          // const json = await faceapi.fetchJson('/files/example.json')
          // console.log(json)
          // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          // faceapi.draw.drawDetections(canvas, resizedDetections)
          // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
          // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }, 100)
      })
  
      //touch
      window.removeEventListener("touchstart", this.keyup);
      window.removeEventListener("touchend", this.keydown);
  
      window.addEventListener("touchstart", this.keyup);
      window.addEventListener("touchend", this.keydown);
    }
  
    touchstart = () => {
      this.jumpPressed = true;
    };
  
    touchend = () => {
      this.jumpPressed = false;
    };
  
    keydown = (event) => {
      if (event.code === "Space") {
        this.jumpPressed = true;
      }
    };
  
    keyup = (event) => {
      if (event.code === "Space") {
        this.jumpPressed = false;
      }
    };

    // jump(isJump) {
    //   if (isJump) {
    //     this.jumpPressed = true;
    //   }
    //   console.log(true)
    // }
  
    update(gameSpeed, frameTimeDelta) {
      this.run(gameSpeed, frameTimeDelta);
  
      if (this.jumpInProgress) {
        this.image = this.standingStillImage;
      }
  
      this.jump(frameTimeDelta);
    }
  
    jump(frameTimeDelta) {
      if (this.jumpPressed) {
        this.jumpInProgress = true;
      }
  
      if (this.jumpInProgress && !this.falling) {
        if (
          this.y > this.canvas.height - this.minJumpHeight ||
          (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
        ) {
          this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
        } else {
          this.falling = true;
        }
      } else {
        if (this.y < this.yStandingPosition) {
          this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
          if (this.y + this.height > this.canvas.height) {
            this.y = this.yStandingPosition;
          }
        } else {
          this.falling = false;
          this.jumpInProgress = false;
        }
      }
    }
  
    run(gameSpeed, frameTimeDelta) {
      if (this.walkAnimationTimer <= 0) {
        if (this.image === this.dinoRunImages[0]) {
          this.image = this.dinoRunImages[1];
        } else {
          this.image = this.dinoRunImages[0];
        }
        this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
      }
      this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }
  
    draw() {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }