import React,{useState,useEffect} from "react"
import { useSelector,useDispatch } from "react-redux"
import { setPaidPayments, setProgress } from "../../../redux/reducers/payments"

const ProgressBar = ()=>{
    const payments = useSelector((state)=>state.payments)
    const loan = useSelector((state)=>state.loans)
    const dispatch = useDispatch()

    useEffect(() => {
        async function init(){
            if (!loan.loan?.id) return;

            const paymentsData = await window.database.models.Payments.getPayments({
                select: `COUNT(*) AS totalCount,
                SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paidCount,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
                SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) AS expiredCount,
                SUM(CASE WHEN status = 'incomplete' THEN 1 ELSE 0 END) AS incompleteCount`,
                where: `loan_id = '${loan.loan.id}'`
            })

            const paidPayments = paymentsData[0].paidCount;
            dispatch(setPaidPayments(paidPayments))
            
            const progressPercentage = paymentsData[0].totalCount > 0 ? (paidPayments / paymentsData[0].totalCount) * 100 : 0;
            dispatch(setProgress(progressPercentage))
        }

        init()
    }, [dispatch, loan.loan?.id, payments.paidPayments])

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso del préstamo</span>
                <span className="text-sm font-medium text-gray-700">{payments.progressbar.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${payments.progressbar}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Cuotas pagadas: {payments.paidPayments}</span>
                <span className="text-xs text-gray-500">Total cuotas: {payments.totalPayments}</span>
            </div>
        </div>
    )
}

export default ProgressBar