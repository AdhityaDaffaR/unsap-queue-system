import { supabase } from './supabase.js';

const CHANNEL_NAME = 'realtime_sync';

let channel = null;

export const initBroadcast = () => {
  if (channel) return;
  channel = supabase.channel(CHANNEL_NAME, {
    config: { broadcast: { self: true } }
  });
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log(`📡 Broadcast channel "${CHANNEL_NAME}" siap.`);
    }
  });
};

export const broadcastUpdate = async (event = 'data_changed', payload = {}) => {
  if (!channel) {
    console.warn('⚠️ Broadcast channel belum diinisialisasi.');
    return;
  }
  try {
    await channel.send({
      type: 'broadcast',
      event,
      payload: { timestamp: Date.now(), ...payload },
    });
  } catch (err) {
    console.error(`❌ Gagal broadcast event "${event}":`, err.message);
  }
};
