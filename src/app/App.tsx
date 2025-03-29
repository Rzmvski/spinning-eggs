import React, { useState } from 'react';
import './styles.less';
import { Egg } from 'src/shared/egg/Egg';
import { PopUp } from 'src/shared/pop-up/PopUp';

export const App = () => {
  const [isLeftSpinning, setIsLeftSpinning] = useState(false);
  const [isRightSpinning, setIsRightSpinning] = useState(false);

  return <div className={'container'}>
    <div className={'egg-wrapper'}>
      <Egg defaultSpeed={0} onSpinningChange={setIsLeftSpinning} />
    </div>
    <div className={'egg-wrapper'}>
      <Egg defaultSpeed={0} onSpinningChange={setIsRightSpinning} />
    </div>
    <PopUp isSpinning={isLeftSpinning || isRightSpinning} />
  </div>;
};
