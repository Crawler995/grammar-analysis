import React from 'react'
import { Card, Typography } from 'antd'

interface IProps {
  grammarTypes: string[] | null;
}

export default function Summary(props: IProps) {
  return (
    <Card title="Summary" style={{
      marginTop: '20px'
    }}>
      <Typography>
        {
          props.grammarTypes === null ?
          <Typography.Paragraph>
            Wait...
          </Typography.Paragraph> :
          <>
            {
              props.grammarTypes.length === 0 ?
              <Typography.Paragraph><b>This grammar isn't any grammar above!</b></Typography.Paragraph> :
              <Typography.Paragraph><b>{`This grammar is a ${props.grammarTypes.join(', ')} grammar.`}</b></Typography.Paragraph>
            }

            <Typography.Paragraph>
              You can click the button "↑" in the right bottom to go back to top.
            </Typography.Paragraph>
          </>
        }
      </Typography>
    </Card>
  )
}
