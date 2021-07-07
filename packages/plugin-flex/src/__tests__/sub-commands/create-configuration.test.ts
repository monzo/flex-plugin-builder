import CreateConfiguration from '../../sub-commands/create-configuration';
import createTest from '../framework';

const descriptionFlex = '--description';
const nameFlex = '--name';
const enablePluginFlex = '--enable-plugin';
const disablePluginFlex = '--disable-plugin';
const newFlex = '--new';
const pluginFlex = '--plugin';

describe('SubCommands/CreateConfiguration', () => {
  class Plugin extends CreateConfiguration {}

  const name = 'configuration-name';
  const description = 'configuration-description';
  const enablePlugin = 'enable-plugin';
  const disablePlugin = 'disable-plugin';
  const aliasPlugin = 'alias-plugin';

  const createConfiguration = jest.fn();

  const mockPluginsApiToolkit = (cmd: Plugin) => {
    // @ts-ignore
    jest.spyOn(cmd, 'pluginsApiToolkit', 'get').mockReturnValue({ createConfiguration });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should have flag as own property', () => {
    expect(CreateConfiguration.hasOwnProperty('flags')).toEqual(true);
  });

  it('should call createConfiguration from the toolkit with enablePlugins', async () => {
    const cmd = await createTest(Plugin)(nameFlex, name, descriptionFlex, description, enablePluginFlex, enablePlugin);
    mockPluginsApiToolkit(cmd);

    // @ts-ignore
    await cmd.createConfiguration();

    expect(createConfiguration).toHaveBeenCalledTimes(1);
    expect(createConfiguration).toHaveBeenCalledWith({
      name,
      description,
      fromConfiguration: 'active',
      removePlugins: [],
      addPlugins: [enablePlugin],
    });
  });

  it('should support using --plugin', async () => {
    const cmd = await createTest(Plugin)(nameFlex, name, descriptionFlex, description, pluginFlex, aliasPlugin);
    mockPluginsApiToolkit(cmd);

    // @ts-ignore
    await cmd.createConfiguration();

    expect(createConfiguration).toHaveBeenCalledWith({
      name,
      description,
      fromConfiguration: 'active',
      removePlugins: [],
      addPlugins: [aliasPlugin],
    });
  });

  it('should support enable and disable', async () => {
    const cmd = await createTest(Plugin)(
      nameFlex,
      name,
      descriptionFlex,
      description,
      enablePluginFlex,
      enablePlugin,
      disablePluginFlex,
      disablePlugin,
    );
    mockPluginsApiToolkit(cmd);

    // @ts-ignore
    await cmd.createConfiguration();

    expect(createConfiguration).toHaveBeenCalledWith({
      name,
      description,
      fromConfiguration: 'active',
      removePlugins: [disablePlugin],
      addPlugins: [enablePlugin],
    });
  });

  it('should support enable and disable and alias', async () => {
    const cmd = await createTest(Plugin)(
      nameFlex,
      name,
      descriptionFlex,
      description,
      enablePluginFlex,
      enablePlugin,
      disablePluginFlex,
      disablePlugin,
      pluginFlex,
      aliasPlugin,
    );
    mockPluginsApiToolkit(cmd);

    // @ts-ignore
    await cmd.createConfiguration();

    expect(createConfiguration).toHaveBeenCalledWith({
      name,
      description,
      fromConfiguration: 'active',
      removePlugins: [disablePlugin],
      addPlugins: [enablePlugin, aliasPlugin],
    });
  });

  it('should support --new', async () => {
    const cmd = await createTest(Plugin)(nameFlex, name, descriptionFlex, description, newFlex);
    mockPluginsApiToolkit(cmd);

    // @ts-ignore
    await cmd.createConfiguration();

    expect(createConfiguration).toHaveBeenCalledWith({
      name,
      description,
      removePlugins: [],
      addPlugins: [],
    });
  });
});
