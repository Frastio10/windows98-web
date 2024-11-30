import { logger } from "../../logger";

export default class DeviceAudioDriver {
  private audioContext: AudioContext | null;
  private audioBuffer: AudioBuffer | null;
  private gainNode: GainNode | null;
  initialized: boolean = false;

  constructor() {
    this.audioContext = null;
    this.audioBuffer = null;
    this.gainNode = null; // Initialize gain node to control volume
  }

  // Initialize the AudioContext (a required object for managing audio)
  initialize() {
    if (window && window.AudioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain(); // Create a GainNode to control volume
      this.initialized = true;
    } else {
      logger.error("AudioContext is not supported in this environment.");
    }
  }

  terminate() {
    if (this.audioContext) {
      this.audioContext
        .close()
        .then(() => {
          this.audioContext = null;
          this.audioBuffer = null;
          this.gainNode = null; // Clean up the gain node
          this.initialized = false;
        })
        .catch((error) => {
          console.error("Error terminating audio context:", error);
        });
    } else {
      logger.error("AudioDriver is not initialized");
    }
  }

  getStatus() {
    if (this.initialized) return "ok";
    else return "not ok";
  }

  // Load an audio file into the buffer
  async loadAudio(url: string) {
    if (!this.audioContext) {
      return logger.error("AudioDriver is not initialized");
    }
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      logger.info("Audio loaded successfully");
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  }

  // Play the loaded audio
  play() {
    if (!this.audioContext || !this.audioBuffer || !this.gainNode) {
      return logger.error("AudioDriver is not initialized or no audio loaded");
    }
    console.log("playing", this.audioContext);
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(this.gainNode); // Connect the source to the gain node
      this.gainNode.connect(this.audioContext.destination); // Connect the gain node to the destination (speakers)
      source.start();
      logger.info("Audio is now playing");
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  // Set the volume (gain value)
  setVolume(value: number) {
    if (!this.gainNode) {
      return logger.error("AudioDriver is not initialized");
    }
    this.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime); // Set volume (between 0 and 1)
    logger.info(`Volume set to ${value}`);
  }

  // Pause the audio (if needed, this example does not handle pause directly, but could be extended)
  pause() {
    if (!this.audioContext) {
      return logger.error("AudioDriver is not initialized");
    }
    // Implement pause functionality here
    logger.info("Audio paused (Functionality to be added)");
  }

  // Stop the audio (can be extended for full stop behavior)
  stop() {
    if (!this.audioContext) {
      return logger.error("AudioDriver is not initialized");
    }
    // Implement stop functionality here
    logger.info("Audio stopped (Functionality to be added)");
  }
}
