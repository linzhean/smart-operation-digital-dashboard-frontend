{
  isFormVisible && (
    <div className={styles.checkFormContainer}>
      <div className={styles.formOverlay} onClick={handleCloseForm}></div>
      <div className={styles.checkFormContent}>
        <h2>申請臨時圖表</h2>
        <form onSubmit={handleRequestSubmit}>
          <div className={styles.applyKPIlabelGroup}>
            <label htmlFor='guarantor'>保證人</label>
            <select
              id='guarantor'
              value={selectedUser || ''}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">請選擇</option>
              {users.map(user => (
                <option key={user.userId} value={user.userId}>
                  {user.userName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.applyKPIlabelGroup}>

            <label htmlFor='KPIstartDate'>開始日期</label>
            <DatePicker
              id='KPIstartDate'
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="選擇開始日期"
              required
              autoComplete="off"
            />
          </div>
          <div className={styles.applyKPIlabelGroup}>

            <label htmlFor='KPIendDate'>結束日期</label>
            <DatePicker
              id='KPIendDate'
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="選擇結束日期"
              required
              autoComplete="off"
            />
          </div>
          
          <div className={styles.LastapplyKPIlabelGroup}>
            <textarea
              className={styles.applyKPItextarea}
              placeholder='請填寫此次申請理由'
              name="applyReason"
              value={applyReason}
              onChange={(e) => setApplyReason(e.target.value)}
              required
            />
          </div>
          <div className={styles.KPIbuttonGroup}>
            <button type="button" onClick={handleCloseForm} className={styles.cancel}>取消</button>
            <button type="submit" className={styles.submit}>提交</button>

          </div>
        </form>
      </div>
    </div>
  )
}
