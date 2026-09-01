import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import {SettingProps, SettingTitle} from "@/entity";
import {SettingCard} from "@/components/ui-kit-setting";
import {Button, Input, Space} from "antd";
import {useText} from "@/core/utils/text_display.ts";
import {useSettingStore} from "@/core/global/settingStore.ts";
import {LuSave} from "react-icons/lu";
import {useEffect, useState} from "react";
import {stringhelper} from "@/core/helpers/StringHelper.ts";

export const StudentSettings = ({settings}: SettingProps) => {
    const text = useText()
    const initNames = text.student.label
    const [studentNames, setStudentNames] = useState<string>(initNames)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const disabled = stringhelper.changeCase(studentNames, {compareWith: initNames, ignoreCaseInCompare: true})

    const update = useSettingStore(s => s.updateSetting)

    useEffect(() => {
        setStudentNames(settings?.studentnames as string ?? '')
    }, [settings?.studentnames]);

    const handleUpdateStudentNames = async () => {
        if (disabled) return
        setIsSaving(true)
        try {
            await update(SettingTitle.STUDENT_NAMES, studentNames)
        }catch (err) {
            setStudentNames(settings?.studentnames as string ?? text.student.label)
        }finally {
            setIsSaving(false)
        }
    }

    return(
        <Responsive gutter={[16, 16]} justify='center'>
            <Grid xs={24} md={12} lg={12} xxl={12}>
                <PageWrapper>
                    <SettingCard title={<span>Appellation des apprénants</span>}>
                        <Space.Compact>
                            <Input value={studentNames} onChange={(e) => setStudentNames(e.target.value)} />
                            <Button type='primary' icon={<LuSave />} loading={isSaving} onClick={handleUpdateStudentNames} disabled={Boolean(disabled)} />
                        </Space.Compact>
                   </SettingCard>
                </PageWrapper>
            </Grid>
        </Responsive>
    )
}