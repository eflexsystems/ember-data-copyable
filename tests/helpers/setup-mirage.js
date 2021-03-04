import defineModels from './define-models';
import { startMirage } from 'dummy/initializers/ember-cli-mirage';
import RSVP from 'rsvp';
import { getOwner } from '@ember/application';

export default function setupMirage(application) {
  // Register our models
  const Models = defineModels(application, { async: false });

  // Setup Mirage Server
  application.server = startMirage();

  // Setup the store
  application.store = getOwner(application).lookup('service:store');

  return RSVP.all(
    Object.keys(Models)
      .filter((name) => name !== 'foo-fragment')
      .map((name) => application.store.findAll(name))
  );
}
