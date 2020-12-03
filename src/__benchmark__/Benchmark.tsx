import React, { Profiler, ProfilerProps } from 'react';
import ReactDOM from 'react-dom';
import { unstable_trace as trace } from 'scheduler/tracing';
import { median, quantile } from 'simple-statistics';
import {
  View, Panel,
  PanelHeader, PanelHeaderBack, PanelHeaderContent, PanelHeaderButton,
  Epic, Tabbar, TabbarItem,
  ActionSheet, ActionSheetItem,
  Group, Header, SimpleCell, Switch, Avatar, IconButton, Counter, AdaptivityProvider, ConfigProvider,
  Platform,
} from '..';
import { getAvatarUrl } from '../../styleguide/utils';
import { Icon28NewsfeedOutline } from '@vkontakte/icons';

const BenchmarkData = () => {
  return (
    <ConfigProvider platform={Platform.ANDROID}>
      <AdaptivityProvider viewHeight={720} viewWidth={320}>
        <View id="feed" activePanel="feed">
          <Panel id="feed">
            <PanelHeader
              left={<PanelHeaderBack />}
              right={(
                <PanelHeaderButton label={<Counter size="s" mode="prominent">21</Counter>}>
                  <Icon28NewsfeedOutline />
                </PanelHeaderButton>
              )}
            >
              <PanelHeaderContent before={<Avatar size={36} />} status="Был в сети вчера">
                Влад Анесов
              </PanelHeaderContent>
            </PanelHeader>
            <Group>
              <Header mode="secondary">Меню</Header>
              <SimpleCell expandable before={<Icon28NewsfeedOutline />}>Аккаунт</SimpleCell>
              <SimpleCell expandable before={<Icon28NewsfeedOutline />}>Внешний вид</SimpleCell>
              <SimpleCell expandable before={<Icon28NewsfeedOutline />}>Основные</SimpleCell>
            </Group>
            <Group>
              <Header mode="secondary">Настройки</Header>
              <SimpleCell disabled after={<Switch defaultChecked />}>Сжимать фотографии</SimpleCell>
              <SimpleCell disabled after={<Switch />}>Сжимать видео</SimpleCell>
            </Group>
            <Group>
              <Header mode="secondary">Настройки системы</Header>
              <SimpleCell expandable indicator="Русский">Язык</SimpleCell>
              <SimpleCell expandable indicator="При использовании">Геолокация</SimpleCell>
            </Group>
            <Group>
              <Header mode="secondary">Список диалогов</Header>
              <SimpleCell before={<Avatar size={40} src={getAvatarUrl('user_xyz')} />} after={<IconButton icon={<Icon28NewsfeedOutline />} />}>Игорь Фёдоров</SimpleCell>
              <SimpleCell before={<Avatar size={40} src={getAvatarUrl('user_arthurstam')} />} after={<IconButton icon={<Icon28NewsfeedOutline />} />}>Artur Stambultsian</SimpleCell>
            </Group>
            <Group>
              <Header mode="secondary">Список друзей</Header>
              <SimpleCell
                before={<Avatar size={48} src={getAvatarUrl('user_xyz')} />}
                after={<IconButton icon={<Icon28NewsfeedOutline />} />}
                description="Команда ВКонтакте"
              >Игорь Фёдоров</SimpleCell>
              <SimpleCell
                before={<Avatar size={48} src={getAvatarUrl('user_arthurstam')} />}
                after={<IconButton icon={<Icon28NewsfeedOutline />} />}
                description="Бот"
              >Artur Stambultsian</SimpleCell>
            </Group>
          </Panel>
        </View>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

const range = (count: number) => {
  const arr: number[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(i);
  }
  return arr;
};

type Interactions = 'mount' | 'update' | 'unmount';
export const benchmark = ({ count = 100 } = {}) => {
  const node = document.getElementById('mount');
  let runs = 0;
  const timings: { [Key in Interactions]: number[] } = {
    mount: [],
    update: [],
    unmount: [],
  };
  const steps = [{
    name: 'mount',
    run: ({ node, jsx }) => ReactDOM.render(jsx, node),
  }, {
    name: 'update',
    run: ({ node, jsx }) => ReactDOM.render(jsx, node),
  }, {
    name: 'unmount',
    run: ({ node, jsx }) => ReactDOM.render(jsx, node),
    hide: true,
  }];

  const afterAll = () => {
    const formatTiming = (t: number[]) => [quantile(t, 0.05), median(t), quantile(t, 0.95)];
    console.table(Object.entries(timings).reduce((acc, [metric, t]) => ({ ...acc, [metric]: formatTiming(t) }), {}));
  };
  let currentStep: Interactions = 'mount';

  const onRender: ProfilerProps['onRender'] = (_1, _2, duration, _4, _5, _6, interactions) => {
    if (Array.from(interactions).some((item) => item.name === currentStep)) {
      recordStep(duration);
    }
  };

  function recordStep(duration: number) {
    timings[currentStep].push(duration);
    const nextStep = steps[(steps.findIndex((step) => step.name === currentStep) + 1) % steps.length];
    const isIterDone = nextStep === steps[0];
    if (isIterDone) {
      runs += 1;
    }
    if (runs === count) {
      return afterAll();
    }
    runStep(nextStep);
  }

  function runStep(step) {
    currentStep = step.name;
    requestAnimationFrame(() => {
      trace(step.name, performance.now(), () => {
        step.run({
          jsx: (
            <Profiler id="main" onRender={onRender}>
              {!step.hide && range(10).map((i) => <BenchmarkData key={i} />)}
            </Profiler>
          ),
          node,
        });
      });
    });
  }

  runStep(steps[0]);
};
