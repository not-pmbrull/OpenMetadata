/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, Menu, Space, Tooltip } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NO_PERMISSION_FOR_ACTION } from '../../../../constants/HelperTextUtil';
import { EntityType } from '../../../../enums/entity.enum';
import { ANNOUNCEMENT_ENTITIES } from '../../../../utils/AnnouncementsUtils';
import SVGIcons, { Icons } from '../../../../utils/SvgUtils';
import DeleteWidgetModal from '../../DeleteWidget/DeleteWidgetModal';
import './ManageButton.less';

interface Props {
  allowSoftDelete?: boolean;
  afterDeleteAction?: () => void;
  buttonClassName?: string;
  entityName: string;
  entityId?: string;
  entityType?: string;
  entityFQN?: string;
  isRecursiveDelete?: boolean;
  deleteMessage?: string;
  softDeleteMessagePostFix?: string;
  hardDeleteMessagePostFix?: string;
  canDelete?: boolean;
  extraDropdownContent?: ItemType[];
  onAnnouncementClick?: () => void;
  onRestoreEntity?: () => void;
  deleted?: boolean;
}

const ManageButton: FC<Props> = ({
  allowSoftDelete,
  afterDeleteAction,
  buttonClassName,
  deleteMessage,
  softDeleteMessagePostFix,
  hardDeleteMessagePostFix,
  entityName,
  entityType,
  canDelete,
  entityId,
  isRecursiveDelete,
  extraDropdownContent,
  onAnnouncementClick,
  onRestoreEntity,
  deleted,
}) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const menu = (
    <Menu
      items={[
        {
          label: (
            <Tooltip title={canDelete ? '' : NO_PERMISSION_FOR_ACTION}>
              <Space
                className={classNames('tw-cursor-pointer manage-button', {
                  'tw-cursor-not-allowed tw-opacity-50': !canDelete,
                })}
                size={8}
                onClick={(e) => {
                  if (canDelete) {
                    e.stopPropagation();
                    setIsDelete(true);
                    setShowActions(false);
                  }
                }}>
                <SVGIcons alt="Delete" icon={Icons.DELETE} />
                <div className="tw-text-left" data-testid="delete-button">
                  <p
                    className="tw-font-medium"
                    data-testid="delete-button-title">
                    {t('label.delete')}
                  </p>
                  <p className="tw-text-grey-muted tw-text-xs">
                    {t('message.delete-action-description', {
                      entityType,
                    })}
                  </p>
                </div>
              </Space>
            </Tooltip>
          ),
          key: 'delete-button',
        },
        ...(deleted
          ? [
              {
                label: (
                  <Tooltip title={canDelete ? '' : NO_PERMISSION_FOR_ACTION}>
                    <Space
                      className={classNames('tw-cursor-pointer manage-button', {
                        'tw-cursor-not-allowed tw-opacity-50': !canDelete,
                      })}
                      size={8}
                      onClick={(e) => {
                        if (canDelete) {
                          e.stopPropagation();
                          setShowActions(false);
                          onRestoreEntity && onRestoreEntity();
                        }
                      }}>
                      <SVGIcons alt="Restore" icon={Icons.RESTORE} />
                      <div
                        className="tw-text-left"
                        data-testid="restore-button">
                        <p
                          className="tw-font-medium"
                          data-testid="delete-button-title">
                          {t('label.restore')}
                        </p>
                        <p className="tw-text-grey-muted tw-text-xs">
                          {t('message.restore-action-description', {
                            entityType,
                          })}
                        </p>
                      </div>
                    </Space>
                  </Tooltip>
                ),
                key: 'restore-button',
              },
            ]
          : []),

        ...(ANNOUNCEMENT_ENTITIES.includes(entityType as EntityType)
          ? [
              {
                label: (
                  <Space
                    className="tw-cursor-pointer manage-button"
                    size={8}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(false);
                      onAnnouncementClick && onAnnouncementClick();
                    }}>
                    <SVGIcons
                      alt="announcement"
                      icon={Icons.ANNOUNCEMENT_BLACK}
                    />
                    <div
                      className="tw-text-left"
                      data-testid="announcement-button">
                      <p className="tw-font-medium">
                        {t('label.announcements')}
                      </p>
                      <p className="tw-text-grey-muted tw-text-xs">
                        {t('message.announcement-action-description')}
                      </p>
                    </div>
                  </Space>
                ),
                key: 'announcement-button',
              },
            ]
          : []),
        ...(extraDropdownContent ? extraDropdownContent : []),
      ]}
    />
  );

  return (
    <>
      <Dropdown
        align={{ targetOffset: [-12, 0] }}
        overlay={menu}
        overlayStyle={{ width: '350px' }}
        placement="bottomRight"
        trigger={['click']}
        visible={showActions}
        onVisibleChange={setShowActions}>
        <Button
          className={classNames(
            'tw-rounded tw-flex tw-justify-center tw-w-6 manage-dropdown-button',
            buttonClassName
          )}
          data-testid="manage-button"
          size="small"
          title="Manage"
          type="default"
          onClick={() => setShowActions(true)}>
          <FontAwesomeIcon
            className="tw-text-primary tw-self-center manage-dropdown-icon"
            icon="ellipsis-vertical"
          />
        </Button>
      </Dropdown>
      {isDelete && (
        <DeleteWidgetModal
          afterDeleteAction={afterDeleteAction}
          allowSoftDelete={allowSoftDelete}
          deleteMessage={deleteMessage}
          entityId={entityId || ''}
          entityName={entityName || ''}
          entityType={entityType || ''}
          hardDeleteMessagePostFix={hardDeleteMessagePostFix}
          isRecursiveDelete={isRecursiveDelete}
          softDeleteMessagePostFix={softDeleteMessagePostFix}
          visible={isDelete}
          onCancel={() => setIsDelete(false)}
        />
      )}
    </>
  );
};

export default ManageButton;
