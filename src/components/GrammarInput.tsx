import React from 'react';
import { Card, Button, Form, Input, Space, Row, Col, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { EMPTY, PRIME, Grammar } from '../grammar-analysis/types/grammar';

interface IProps {
  onFinish: (values: any) => void;
}

interface IState {
  grammar: Grammar;
}

interface RawProduction {
  left: string;
  right: string;
}

export default class GrammarInput extends React.Component<IProps, IState> {
  state: IState = {
    grammar: {
      nonTerminals: [],
      terminals: [],
      productions: [],
      startSymbol: ''
    }
  }

  mergePrime = (arr: string[]) => {
    return arr.reduce((res, cur) => {
      if(cur === PRIME) {
        res[res.length - 1] += PRIME;
      } else {
        res.push(cur);
      }
      return res;
    }, [] as string[])
  }

  onFinish = (values: any) => {
    const rawProductions: RawProduction[] = values.productions;
    const disposedProductions = rawProductions.map((production) => (
      {
        left: this.mergePrime(production.left.split('')),
        right: production.right.split('|').map(item => item === 'EMPTY' ? [EMPTY] : this.mergePrime(item.split('')))
      }
    ));

    const nonTerminals: string[] = [];
    const terminals: string[] = [];
    disposedProductions.forEach(p => {
      const {left, right} = p;
      nonTerminals.push(...(left.filter(c => /^[A-Z]'?$/.test(c))));
      right.forEach(r => nonTerminals.push(...(r.filter(c => /^[A-Z]'?$/.test(c)))));
      terminals.push(...(left.filter(c => /^[a-z]$/.test(c))));
      right.forEach(r => terminals.push(...(r.filter(c => /^[a-z]$/.test(c)))));
    });

    const grammar: Grammar = {
      nonTerminals: [...new Set(nonTerminals)], 
      terminals: [...new Set(terminals)], 
      productions: disposedProductions, startSymbol: nonTerminals[0]
    };

    this.props.onFinish(grammar);
    this.setState({grammar});
  }

  render() {
    return (
      <Card title="Input Grammar:">
        <Row gutter={24}>
          <Col span={12}>
          <Typography>
            <Typography.Paragraph>
              Noticed: <br></br>
              1. The /^[A-Z]'?$/ will be regarded as non-terminal and the /^[a-z]$/ will be regarded as terminal;<br></br>
              2. The first appeared non-terminal will be regarded as the start symbol;
            </Typography.Paragraph>
            <Typography.Paragraph>
              e.g.<br></br>
              {`A' -> B'a|c|${EMPTY}, B' -> d`}<br></br>
              For the first production you can input "A'" in left and input "B'a|c|EMPTY" in right. <br></br>
              The non-terminals will be [A', B'], the terminals will be [a, b, c, d], the start symbol will be A'.
            </Typography.Paragraph>
          </Typography>

            <Form name="grammar" onFinish={this.onFinish} autoComplete="off">
              <Form.List name="productions">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map(field => (
                        <Space key={field.key} style={{ display: 'flex' }} align="start">
                          <Form.Item
                            {...field}
                            name={[field.name, 'left']}
                            fieldKey={[field.fieldKey, 'left']}
                            rules={[{ required: true, message: 'Missing left part of production!' }]}
                          >
                            <Input placeholder="left" />
                          </Form.Item>
                          <span style={{ fontSize: '18px' }}>-></span>
                          <Form.Item
                            {...field}
                            name={[field.name, 'right']}
                            fieldKey={[field.fieldKey, 'right']}
                            rules={[{ required: true, message: 'Missing right part of production!' }]}
                          >
                            <Input placeholder="right" />
                          </Form.Item>
                          <MinusCircleOutlined
                            style={{
                              marginTop: '4px',
                              fontSize: '24px'
                            }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </Space>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          block
                        >
                          <PlusOutlined /> Add new production
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Confirm && Preview Grammar
                </Button>

                <Button type="primary" htmlType="button">
                  Start to Compute!
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col span={12}>
            <Card type="inner" title="Current Grammar Preview">
              G = ( VN, VT, S, P )<br></br>
              VN = {`{ ${this.state.grammar.nonTerminals.join(', ')} }`}<br></br>
              VT = {`{ ${this.state.grammar.terminals.join(', ')} }`}<br></br>
              S = {this.state.grammar.startSymbol}<br></br>
              P = {`{ ${
                this.state.grammar.productions.map(p => {
                  return `${p.left.join('')} -> ${p.right.map(r => r.join('')).join('|') }`
                }).join(', ')
              } }`}
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }
}
