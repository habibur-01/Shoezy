import React from 'react';
import {
  MessageSquare,
  Instagram,
  Phone,
  Store,
  Share2,
  Video,
  UserCheck,
  Check,
} from 'lucide-react';
import { SocialOrderSource } from '../../types';
import { useAdmin } from '../../context/AdminContext';

interface SourceChannelSelectorProps {
  source: SocialOrderSource | string;
  setSource: (source: SocialOrderSource | string) => void;
  sourceHandle: string;
  setSourceHandle: (handle: string) => void;
}

interface ChannelConfig {
  id: SocialOrderSource;
  label: string;
  icon: React.ElementType;
  badge: string;
  placeholder: string;
  bgColor: string;
  textColor: string;
  activeBorder: string;
}

const CHANNELS: ChannelConfig[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: MessageSquare,
    badge: 'Messenger / Page',
    placeholder: 'e.g., Messenger chat link or FB Profile Name',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    activeBorder: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    badge: 'Direct Message / Story',
    placeholder: 'e.g., @customer_handle or DM thread ID',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    activeBorder: 'border-pink-500 ring-2 ring-pink-500/20 bg-pink-50/50',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    badge: 'Business Chat',
    placeholder: 'e.g., +1 (555) 019-2831 or WhatsApp Chat ID',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50',
  },
  {
    id: 'tiktok',
    label: 'TikTok Shop',
    icon: Video,
    badge: 'Direct / Live Sale',
    placeholder: 'e.g., @tiktok_username or Live session ref',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    activeBorder: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/50',
  },
  {
    id: 'phone',
    label: 'Phone Order',
    icon: Phone,
    badge: 'Inbound Hotline',
    placeholder: 'e.g., Caller phone number or rep call log ref',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50',
  },
  {
    id: 'storefront',
    label: 'In-Store POS',
    icon: Store,
    badge: 'Walk-in / Pop-up',
    placeholder: 'e.g., Register #1 or Store receipt notes',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50',
  },
  {
    id: 'manual',
    label: 'Other Channel',
    icon: Share2,
    badge: 'Custom Reference',
    placeholder: 'e.g., Email, Twitter/X, Referral partner ref',
    bgColor: 'bg-zinc-50',
    textColor: 'text-zinc-700',
    activeBorder: 'border-zinc-800 ring-2 ring-zinc-800/15 bg-zinc-50',
  },
];

export const SourceChannelSelector: React.FC<SourceChannelSelectorProps> = ({
  source,
  setSource,
  sourceHandle,
  setSourceHandle,
}) => {
  const { currentUser, currentRole } = useAdmin();
  const activeChannel = CHANNELS.find((c) => c.id === source) || CHANNELS[0];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <span>1. Order Origin & Social Channel</span>
            <span className="text-[11px] font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              Omnichannel Intake
            </span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select the social or direct channel where the customer initiated this purchase.
          </p>
        </div>

        {/* Staff Attribution Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-200/80 rounded-lg text-xs text-zinc-600 self-start sm:self-auto">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Intake Staff:</span>
          <strong className="text-zinc-900 font-medium">{currentUser.name}</strong>
          <span className="text-[10px] text-zinc-400">({currentRole.name})</span>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-4">
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          const isSelected = source === ch.id;

          return (
            <button
              key={ch.id}
              type="button"
              id={`btn-channel-${ch.id}`}
              onClick={() => setSource(ch.id)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? ch.activeBorder
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/70 bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${ch.bgColor} ${ch.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-zinc-900">{ch.label}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">{ch.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Social Handle / Profile Input */}
      <div>
        <label
          htmlFor="input-source-handle"
          className="block text-xs font-medium text-zinc-700 mb-1"
        >
          Customer Handle / Chat Reference on {activeChannel.label}{' '}
          <span className="text-zinc-400 font-normal">(optional, for audit trail & follow-ups)</span>
        </label>
        <div className="relative">
          <input
            id="input-source-handle"
            type="text"
            value={sourceHandle}
            onChange={(e) => setSourceHandle(e.target.value)}
            placeholder={activeChannel.placeholder}
            className="w-full text-xs px-3 py-2 bg-zinc-50/50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800 placeholder-zinc-400"
          />
        </div>
      </div>
    </div>
  );
};
