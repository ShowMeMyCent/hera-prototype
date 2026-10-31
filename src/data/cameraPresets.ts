import type { CameraPresetId } from '../types/digitalTwin'

export interface CameraPreset {
  position: [number, number, number]
  target: [number, number, number]
}

/** Elevated, isometric-leaning framings of the estate and its thermal network. */
export const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  overview: { position: [32, 45, 74], target: [0, 0, 2] },
  source: { position: [18, 16, -6], target: [4, 3, -22] },
  network: { position: [16, 15, 22], target: [-3, 1.5, 0] },
  receiver: { position: [18, 16, 38], target: [4, 3, 22] },
}
