import { TabPanel, TabView } from 'primereact/tabview'
import { FC, ReactNode } from 'react'

const ReservationTabs: FC<Props> = ({ tabContents, tabHeaders }) => {
  return (
    <TabView>
      {tabHeaders.map((header, index) => (
        <TabPanel header={header} key={index}>
          {tabContents[index]}
        </TabPanel>
      ))}
    </TabView>
  )
}

interface Props {
  tabHeaders: string[]
  tabContents: ReactNode[]
}

export default ReservationTabs
