export const getTotalLoans = async () => {
    try {
        const loans = await window.database.models.Loans.getLoans({
            select: `
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active_total,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_total
            `
        })

        console.log("loans:----------------------------->",loans)
        return {
            active: loans[0].active_total || 0,
            completed: loans[0].completed_total || 0
        }
    } catch (error) {
        console.log(error)
        return { active: 0, completed: 0 }
    }
}



export const getUnpaidPayments = async () => {
    try {
        const payments = await window.database.models.Payments.getPayments({
            select: `SUM(CASE WHEN status IN ('pending', 'expired', 'incomplete') THEN payments.amount ELSE 0 END) as total_unpaid`,
        })

        console.log("payments:----------------------------->",payments)
        return payments[0].total_unpaid

        
    } catch (error) {
        console.log(error)
        return 0
    }
}


export const getTotalPaidPaymentsMoney = async () => {
    try {
        const payments = await window.database.models.Payments.getPayments({
            select: `SUM(payments.net_amount) as total_amount,
            SUM(payments.gain) as gains,
            SUM(payments.net_amount) as net_gains`,
            joins: 'JOIN loans l ON payments.loan_id = l.id ',
            where: `payments.status = 'paid' AND l.status IN ('active','completed')`
        })

        //console.log("asdasdasdasdasdasdpayments:----------------------------->",payments)
        return {total_amount:payments[0].total_amount,gains:payments[0].gains,net_gains:payments[0].net_gains}
    } catch (error) {
        console.log(error)
        return 0
    }
}

export const getLoansTotalAmounts = async () => {
    try {
        const loans = await window.database.models.Loans.getLoans({
            select: 'SUM(amount) as total_amount,SUM(gain) as gains',
            where: `status='active'`
        })

        return {loans:loans[0].total_amount,gains:loans[0].gains}
      

    } catch (error) {
        console.log(error)
        return 0
    }
}

export const checkAndUpdateActiveLoans = async () => {
    try {
        // Obtener todos los préstamos activos
        const activeLoans = await window.database.models.Loans.getLoans({
            where: "status = 'active'"
        });

        for (const loan of activeLoans) {
            // Verificar si hay pagos pendientes, vencidos o incompletos
            const payments = await window.database.models.Payments.getPayments({
                where: `loan_id = ${loan.id} AND status IN ('pending', 'expired', 'incomplete')`
            });

            // Si no hay pagos pendientes, vencidos o incompletos, el préstamo está completado
            if (payments.length === 0) {
                // Verificar que todos los pagos estén pagados
                const totalPayments = await window.database.models.Payments.getPayments({
                    where: `loan_id = ${loan.id}`
                });

                const paidPayments = await window.database.models.Payments.getPayments({
                    where: `loan_id = ${loan.id} AND status = 'paid'`
                });

                // Solo actualizar si todos los pagos están pagados
                if (totalPayments.length > 0 && totalPayments.length === paidPayments.length) {
                    await window.database.models.Loans.updateLoan({
                        id: loan.id,
                        status: "completed"
                    });
                    console.log(`Préstamo ${loan.id} actualizado a completado`);
                }
            }
        }

        return true;
    } catch (error) {
        console.error("Error al verificar préstamos activos:", error);
        return false;
    }
};

export const getLoansByStatus = async () => {
    try {
        const loans = await window.database.models.Loans.getLoans({
            select: `
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
            `
        })

        return {
            active: loans[0].active || 0,
            completed: loans[0].completed || 0,
            cancelled: loans[0].cancelled || 0
        }
    } catch (error) {
        console.log(error)
        return { active: 0, completed: 0, cancelled: 0 }
    }
}




