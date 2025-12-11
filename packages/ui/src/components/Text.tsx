import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  weight?: 'normal' | 'medium' | 'semibold';
  tone?: 'muted' | 'default';
}

export const Text = ({
  weight = 'normal',
  tone = 'default',
  className,
  ...props
}: TextProps) => {
  const weights: Record<NonNullable<TextProps['weight']>, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold'
  };

  const tones: Record<NonNullable<TextProps['tone']>, string> = {
    default: 'text-white',
    muted: 'text-slate-400'
  };

  return (
    <p
      {...props}
      className={clsx('leading-relaxed', weights[weight], tones[tone], className)}
    />
  );
};
