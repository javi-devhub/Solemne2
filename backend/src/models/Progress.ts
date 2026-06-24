import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const progressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    slot: {
      type: String,
      required: true,
      default: 'main',
      trim: true,
    },
    scene: {
      type: String,
      required: true,
      default: 'SceneP1',
    },
    players: {
      type: Schema.Types.Mixed,
      default: {},
    },
    inventory: {
      type: Schema.Types.Mixed,
      default: {},
    },
    solvedPuzzles: {
      type: [String],
      default: [],
    },
    flags: {
      type: Schema.Types.Mixed,
      default: {},
    },
    playTimeSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

progressSchema.index({ userId: 1, slot: 1 }, { unique: true });

export type ProgressDocument = InferSchemaType<typeof progressSchema>;

export const Progress = mongoose.model('Progress', progressSchema);