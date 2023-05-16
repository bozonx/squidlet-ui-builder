import {RenderedElement} from '../AbstractUi/interfaces/RenderedElement.js';
import {TgReplyButton} from './TgReplyButton.js';


const CALLBACK_COMMANDS = {
  click: 'CLICK|',
  toRoute: 'TO_ROUTE|',
}


const renderComponent: Record<string, (el: RenderedElement) => TgReplyButton[][]> = {

  // TODO: add ForEach ???
  // TODO: add RenderComponent ???

  Document: (el: RenderedElement): TgReplyButton[][] => {
    let res: TgReplyButton[][] = []

    for (const item of el.children || []) {
      res = [
        ...res,
        ...renderComponent[item.name](item),
      ]
    }

    return res
  },
  Button: (el: RenderedElement): TgReplyButton[][] => {
    return [[{
      text: el.params?.text || 'No text',
      callback_data: CALLBACK_COMMANDS.click + el.componentId
    }]]
  },
  ButtonGroup: (el: RenderedElement): TgReplyButton[][] => {
    return [(el.children || [])
      .map((item) => renderComponent[item.name](item)[0][0])]
  },
  Link: (el: RenderedElement): TgReplyButton[][] => {
    return [[{
      text: el.params?.text || 'No text',
      callback_data: CALLBACK_COMMANDS + el.params?.url || '',
    }]]
  },
  ExternalLink: (el: RenderedElement): TgReplyButton[][] => {
    return [[{
      text: el.params?.text || 'No text',
      url: el.params?.url || '',
    }]]
  },
  CheckBox: (el: RenderedElement): TgReplyButton[][] => {

    // TODO: add

    return []
  },
  Container: (el: RenderedElement): TgReplyButton[][] => {
    let res: TgReplyButton[][] = []

    for (const item of el.children || []) {
      res = [
        ...res,
        ...renderComponent[item.name](item),
      ]
    }

    return res
  },
  MainSection: (el: RenderedElement): TgReplyButton[][] => {
    let res: TgReplyButton[][] = []

    for (const item of el.children || []) {
      res = [
        ...res,
        ...renderComponent[item.name](item),
      ]
    }

    return res
  },
  Nav: (el: RenderedElement): TgReplyButton[][] => {
    let res: TgReplyButton[][] = []

    for (const item of el.children || []) {
      res = [
        ...res,
        ...renderComponent[item.name](item),
      ]
    }

    return res
  },
  NestedMenu: (el: RenderedElement): TgReplyButton[][] => {

    // TODO: тут должен быть переход на вложенное меню

    return []
  },
  RadioGroupInput: (el: RenderedElement): TgReplyButton[][] => {

    // TODO: add

    return []
  },
  MultiSelectInput: (el: RenderedElement): TgReplyButton[][] => {

    // TODO: add

    return []
  },
  SelectInput: (el: RenderedElement): TgReplyButton[][] => {

    // TODO: add

    return []
  },
  SideMenu: (el: RenderedElement): TgReplyButton[][] => {
    let res: TgReplyButton[][] = []

    for (const item of el.children || []) {
      res = [
        ...res,
        ...renderComponent[item.name](item),
      ]
    }

    return res
  },
  Text: (el: RenderedElement): TgReplyButton[][] => {

    // TODO: add ??? - а как его напишешь то ???

    return []
  },
  VerticalMenu: (el: RenderedElement): TgReplyButton[][] => {
    let res: TgReplyButton[][] = []

    for (const item of el.children || []) {
      res = [
        ...res,
        ...renderComponent[item.name](item),
      ]
    }

    return res
  },
}


export function transformToTg(el: RenderedElement | RenderedElement[]): TgReplyButton[][] {

  // TODO: наверное взять msg из root???

  const els = (Array.isArray(el)) ? el : el.children || []
  let res: TgReplyButton[][] = []

  for (const item of els) {
    const rendered: TgReplyButton[][] = renderComponent[item.name](item)

    res = [
      ...res,
      ...rendered,
    ]
  }

  return res
}
