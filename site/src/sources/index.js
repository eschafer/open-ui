import _ from 'lodash'

import antd from './antd.json'
import atlassian from './atlassian.json'
import auth0 from './auth0.json'
import boosted from './boosted.json'
import bootstrap from './bootstrap.json'
import carbon from './carbon.json'
import chromium from './chromium.json'
import evergreen from './evergreen.json'
import fabric from './fabric.json'
import fast from './fast.json'
import firefox from './firefox.json'
import goodbarber from './goodbarber.json'
import kolibri from './kolibri.json'
import lightning from './lightning.json'
import lion from './lion.json'
import materialComponentsWeb from './materialComponentsWeb.json'
import materialUI from './materialUI.json'
import primer from './primer.json'
import semantic from './semantic.json'
import spectrum from './spectrum.json'
import stardust from './stardust.json'
import tailwind from './tailwind.json'
import uswds from './uswds.json'
import w3 from './w3.json'
import web from './web.json'
import webkit from './webkit.json'

// Sources
export const sources = [
  antd,
  atlassian,
  auth0,
  boosted,
  bootstrap,
  carbon,
  chromium,
  evergreen,
  fabric,
  fast,
  firefox,
  goodbarber,
  kolibri,
  lightning,
  lion,
  materialComponentsWeb,
  materialUI,
  primer,
  semantic,
  spectrum,
  stardust,
  tailwind,
  uswds,
  w3,
  web,
  webkit,
].map((source) => ({
  ...source,
  components: source.components.map((component) => {
    const componentOpenUIName = component.openUIName || component.name
    return {
      ...component,
      sourceName: source.name,
      openUIName: componentOpenUIName,
      concepts: _.map(component.concepts, (concept) => {
        const conceptOpenUIName = concept.openUIName || concept.name
        return {
          ...concept,
          sourceName: source.name,
          componentName: componentOpenUIName,
          openUIName: conceptOpenUIName,
        }
      }),
    }
  }),
}))

export const sourceNames = _.map(sources, 'name')
export const sourcesCount = sources.length
export const sourceComponentConceptMap = sources.reduce((acc, src) => {
  acc[src.name] = {}

  _.forEach(src.components, (comp) => {
    acc[src.name][comp.openUIName] = {}

    _.forEach(comp.concepts, (con) => {
      acc[src.name][comp.openUIName][con.openUIName] = con
    })
  })

  return acc
}, {})

// Components
const componentList = _.flatMap(sources, 'components')
export const componentOriginalNames = _.map(componentList, 'name')
export const componentsByName = _.groupBy(componentList, 'openUIName')

// Anatomies
export const anatomiesByComponent = _.mapValues(componentsByName, (components) =>
  _.compact(_.uniqBy(_.flatMap(components, 'anatomy'), 'name')),
)

// Concepts
const conceptList = _.compact(_.flatMap(componentList, 'concepts'))

export const openUIConceptsByComponent = _.mapValues(
  _.groupBy(conceptList, 'componentName'),
  (concepts) => _.groupBy(concepts, 'openUIName'),
)

export const conceptsByComponent = _.mapValues(
  _.groupBy(conceptList, 'componentName'),
  (concepts) => _.groupBy(concepts, 'name'),
)

export const getSourcesWithComponentConcept = (
  componentName,
  conceptName,
  conceptOpenUIName = conceptName,
) =>
  _.uniq(
    _.map(
      _.get(conceptsByComponent, [componentName, conceptName]).filter(
        (concept) => concept.name === conceptName && concept.openUIName === conceptOpenUIName,
      ),
      'sourceName',
    ),
  )

// Images
export const getImagesForComponentConcept = (componentOpenUIName, conceptOpenUIName) =>
  _.compact(_.map(_.get(openUIConceptsByComponent, [componentOpenUIName, conceptOpenUIName])))

// Images for component
export const getImagesForComponent = (componentOpenUIName) => {
  const images = []
  const arr = _.map(_.get(openUIConceptsByComponent, componentOpenUIName), (val) =>
    _.map(val, (v) => v.image),
  )
  arr.forEach((a) => a.forEach((i) => images.push(i)))
  return images
}
