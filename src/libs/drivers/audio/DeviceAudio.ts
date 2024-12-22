import { logger } from "../../Logger";

export default class DeviceAudioDriver {
  private audioContext: AudioContext | null;
  private audioCache: Map<string, AudioBuffer>; // Cache for audio buffers
  private gainNode: GainNode | null;
  private currentBuffer: AudioBuffer | null; // Track the current audio buffer
  initialized: boolean = false;

  constructor() {
    this.audioContext = null;
    this.audioCache = new Map();
    this.gainNode = null;
    this.currentBuffer = null;
  }

  initialize() {
    if (window && window.AudioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
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
          this.audioCache.clear(); // Clear the cache
          this.gainNode = null;
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
    return this.initialized ? "ok" : "not ok";
  }

  async loadAudio(url: string) {
    if (!this.audioContext) {
      return logger.error("AudioDriver is not initialized");
    }

    if (this.audioCache.has(url)) {
      this.currentBuffer = this.audioCache.get(url) || null;
      logger.info(`Audio already loaded from cache: ${url}`);
      return;
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer =
        await this.audioContext.decodeAudioData(arrayBuffer);

      this.audioCache.set(url, decodedBuffer);
      this.currentBuffer = decodedBuffer;

      logger.info(`Audio loaded and cached: ${url}`);
    } catch (error) {
      logger.error("Error loading audio:", error);
    }
  }

  play() {
    if (!this.audioContext || !this.currentBuffer || !this.gainNode) {
      return logger.error("AudioDriver is not initialized or no audio loaded");
    }

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.currentBuffer;
      source.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      source.start();
      logger.info("Audio is now playing");
    } catch (error) {
      logger.error("Error playing audio:", error);
    }
  }

  setVolume(value: number) {
    if (!this.gainNode) {
      return logger.error("AudioDriver is not initialized");
    }
    this.gainNode.gain.setValueAtTime(
      value,
      this.audioContext?.currentTime || 0,
    );
    logger.info(`Volume set to ${value}`);
  }

  pause() {
    if (!this.audioContext) {
      return logger.error("AudioDriver is not initialized");
    }
    logger.info("Audio paused (Functionality to be added)");
  }

  stop() {
    if (!this.audioContext) {
      return logger.error("AudioDriver is not initialized");
    }
    logger.info("Audio stopped (Functionality to be added)");
  }
}
