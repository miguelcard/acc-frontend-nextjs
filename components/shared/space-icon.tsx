import { stringIconMapper } from '@/lib/fa-icons-mapper';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


export const SpaceIconLogic = ({ iconAlias, size }: { iconAlias: string | undefined; size?: SizeProp; }) => (
    <FontAwesomeIcon icon={stringIconMapper[iconAlias || 'rocket']} size={size} />
);
