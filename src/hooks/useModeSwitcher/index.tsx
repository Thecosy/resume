import React from 'react';
import cx from 'classnames';
import { Popover } from 'antd';
import qs from 'query-string';
import { getLocale } from '@/locale';
import { getSearchObj } from '@/helpers/location';
import './index.less';

export function getMode() {
  const query = getSearchObj();
  return (query ? query.mode : 'read') as string;
}

export const useModeSwitcher = ({
  className,
}: {
  className?: string;
}): [JSX.Element, string, (v) => void] => {
  const i18n = getLocale();
  const mode = getMode();
  const query = getSearchObj();

  const changeMode = value => {
    if (value === mode) return;
    const {
      pathname,
      hash: currentHash,
      search: currentSearch,
    } = window.location;
    const hash = currentHash === '#/' ? '' : currentHash;
    const search = qs.stringify({
      ...qs.parse(currentSearch),
      mode: value,
    });

    window.location.href = `${pathname}?${search}${hash}`;
  };

  const canPreview = !query.user;

  return [
    <div className={cx('mode-switcher', className)}>
      {mode !== 'edit' && (
        <span className={cx('mode-item')} onClick={() => changeMode('edit')}>
          {i18n.get('编辑')}
        </span>
      )}
      {mode === 'edit' &&
        (canPreview ? (
          <Popover content={i18n.get('无用户信息，不允许预览')}>
            <span>{i18n.get('预览')}</span>
          </Popover>
        ) : (
          <span className={cx('mode-item')} onClick={() => changeMode('read')}>
            {i18n.get('预览')}
          </span>
        ))}
    </div>,
    mode,
    changeMode,
  ];
};
