import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useGlobalStore} from "../../core/global/store.ts";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {Card, Input} from "antd";

export const Organization = () => {

    useDocumentTitle({
        title: "Setting - Organization",
        description: "Setting description",
    })

    const academicYear = useGlobalStore.use.academicYear()
    const updateAcademicYear = useGlobalStore.use.updateAcademicYear()

    return(
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={8}>
                <Card>
                    <Input
                        value={academicYear}
                        onChange={(e) => updateAcademicYear(e.target.value)}
                    />
                </Card>
            </Grid>
        </Responsive>
    )
}